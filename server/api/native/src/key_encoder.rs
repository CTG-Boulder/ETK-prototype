use rayon::prelude::*;
use gmp::{rand::RandState, mpz::Mpz};

// Rust rand book says:
// Often you can just use thread_rng, a function which automatically
// initializes an RNG in thread-local memory and returns a reference to it.
// It is fast, good quality, and (to the best of our knowledge)
// cryptographically secure.
use rand::{thread_rng, rngs::ThreadRng};
use rand::seq::SliceRandom;
use rand::Rng;

const Q_STR : &str = "178171220140272798266866931234182711587930362620029150284400461115532452608037840822207755959815400386995552513197923416018750499205163320936498974491194711240466110744775433547666080531359371170886645011032011430886772038856350858746472169074806457686631687570723108643679182783843207830628037486310057319283";
const P_STR : &str = "356342440280545596533733862468365423175860725240058300568800922231064905216075681644415511919630800773991105026395846832037500998410326641872997948982389422480932221489550867095332161062718742341773290022064022861773544077712701717492944338149612915373263375141446217287358365567686415661256074972620114638567";

struct KeyEncoder {
  p : Mpz,
  q : Mpz,
  a : Mpz,
  a_inv : Mpz,
}

impl KeyEncoder {
  pub fn new(p : Mpz, q : Mpz, a : Mpz) -> Self {
    let u = p.clone() - 1;
    let a_inv = a.invert(&u).unwrap();

    Self {
      p,
      q,
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

pub struct BatchEncoder {
  enc : KeyEncoder,
  rng : ThreadRng,
}

impl BatchEncoder {
  pub fn new() -> Self {
    let q = Mpz::from_str_radix(Q_STR, 10).unwrap();
    let p = Mpz::from_str_radix(P_STR, 10).unwrap();

    // rng
    let mut rng = thread_rng();

    let two = Mpz::one() + Mpz::one();

    let a = {
      let mut rs = RandState::new();
      rs.seed_ui(rng.gen());

      rs.urandom_2exp(1024) * two.clone() + 1
    };

    let enc = KeyEncoder::new(p, q, a);

    Self {
      rng,
      enc,
    }
  }

  pub fn encode_many_and_shuffle(&mut self, key_hex_list : &Vec<String>) -> Vec<String> {
    let mut list = Vec::with_capacity(key_hex_list.len());
    let enc = &self.enc;
    key_hex_list.par_iter()
      .map(|s| enc.encode(s.as_str()))
      .collect_into_vec(&mut list);

    let slice = list.as_mut_slice();
    slice.shuffle(&mut self.rng);
    slice.to_vec()
  }

  pub fn encode(&self, key_hex : &str) -> String {
    self.enc.encode(key_hex)
  }

  pub fn decode(&self, key_encoded_hex : &str) -> String {
    self.enc.decode(key_encoded_hex)
  }

  pub fn get_prime(&self) -> String {
    self.enc.get_prime()
  }
}
