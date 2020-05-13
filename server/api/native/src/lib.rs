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

declare_types! {
  pub class JsKeyEncoder for KeyEncoder {
    init(mut _cx){
      let q = Mpz::from_str_radix(Q_STR, 10).unwrap();
      let p = Mpz::from_str_radix(P_STR, 10).unwrap();
      let mut rng = RandState::new();
      let seed = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64;
      rng.seed_ui(seed);

      let two = Mpz::one() + Mpz::one();
      let a = rng.urandom_2exp(1024) * two.clone() + 1;

      let u = p.clone() - 1;
      let a_inv = a.invert(&u).unwrap();

      Ok(KeyEncoder {
        p,
        q,
        rng,
        a,
        a_inv
      })
    }

    method encode(mut cx) {
      let key_hex = cx.argument::<JsString>(0)?.value();
      let key = Mpz::from_str_radix(key_hex.as_str(), 16).unwrap();
      let this = cx.this();
      let encoded_key = {
        let guard = cx.lock();
        let a = &this.borrow(&guard).a;
        let p = &this.borrow(&guard).p;
        key.powm_sec(&a, &p)
      };

      Ok(cx.string(encoded_key.to_str_radix(16)).upcast())
    }

    method decode(mut cx) {
      let key_encoded_hex = cx.argument::<JsString>(0)?.value();
      let encoded_key = Mpz::from_str_radix(key_encoded_hex.as_str(), 16).unwrap();
      let this = cx.this();
      let decoded_key = {
        let guard = cx.lock();
        let a_inv = &this.borrow(&guard).a_inv;
        let p = &this.borrow(&guard).p;
        encoded_key.powm_sec(&a_inv, &p)
      };

      Ok(cx.string(decoded_key.to_str_radix(16)).upcast())
    }
  }
}

register_module!(mut m, {
  m.export_class::<JsKeyEncoder>("KeyEncoder")?;
  Ok(())
});
