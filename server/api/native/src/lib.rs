use neon::prelude::*;
use neon::register_module;
use std::time::{SystemTime, UNIX_EPOCH};
use gmp::{rand::RandState, mpz::Mpz};

const Q_STR : &str = "178171220140272798266866931234182711587930362620029150284400461115532452608037840822207755959815400386995552513197923416018750499205163320936498974491194711240466110744775433547666080531359371170886645011032011430886772038856350858746472169074806457686631687570723108643679182783843207830628037486310057319283";
const P_STR : &str = "356342440280545596533733862468365423175860725240058300568800922231064905216075681644415511919630800773991105026395846832037500998410326641872997948982389422480932221489550867095332161062718742341773290022064022861773544077712701717492944338149612915373263375141446217287358365567686415661256074972620114638567";

pub struct KeyEncoder {
  p : Mpz,
  q : Mpz,
  rng : RandState,
  a : Mpz,
  a_inv : Mpz,
}

impl KeyEncoder {
  pub fn new() -> Self {
    let q = Mpz::from_str_radix(Q_STR, 10).unwrap();
    let p = Mpz::from_str_radix(P_STR, 10).unwrap();
    let mut rng = RandState::new();
    let seed = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64;
    rng.seed_ui(seed);

    let two = Mpz::one() + Mpz::one();
    let a = rng.urandom_2exp(1024) * two.clone() + 1;

    let u = p.clone() - 1;
    let a_inv = a.invert(&u).unwrap();

    KeyEncoder {
      p,
      q,
      rng,
      a,
      a_inv
    }
  }

  pub fn encode(&self, key_hex : &str) -> String {
    let key = Mpz::from_str_radix(key_hex, 16).unwrap();
    let encoded_key = key.powm_sec(&self.a, &self.p);

    encoded_key.to_str_radix(16)
  }

  pub fn decode(&self, key_encoded_hex : &str) -> String {
    let encoded_key = Mpz::from_str_radix(key_encoded_hex, 16).unwrap();
    let decoded_key = encoded_key.powm_sec(&self.a_inv, &self.p);

    decoded_key.to_str_radix(16)
  }

  pub fn get_prime(&self) -> String { self.p.to_str_radix(16) }
}

declare_types! {
  pub class JsKeyEncoder for KeyEncoder {
    init(mut _cx){
      Ok(KeyEncoder::new())
    }

    method encode(mut cx) {
      let key_hex = cx.argument::<JsString>(0)?.value();
      let this = cx.this();
      let encoded_key = {
        let guard = cx.lock();
        let ke = &this.borrow(&guard);
        ke.encode(key_hex.as_str())
      };

      Ok(cx.string(encoded_key).upcast())
    }

    method decode(mut cx) {
      let key_encoded_hex = cx.argument::<JsString>(0)?.value();
      let this = cx.this();
      let decoded_key = {
        let guard = cx.lock();
        let ke = &this.borrow(&guard);
        ke.decode(key_encoded_hex.as_str())
      };

      Ok(cx.string(decoded_key).upcast())
    }

    method getPrime(mut cx){
      let this = cx.this();
      let prime = {
        let guard = cx.lock();
        let ke = &this.borrow(&guard);
        ke.get_prime()
      };

      Ok(cx.string(prime).upcast())
    }
  }
}

register_module!(mut m, {
  m.export_class::<JsKeyEncoder>("KeyEncoder")?;
  Ok(())
});
