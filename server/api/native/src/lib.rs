use neon::prelude::*;
use neon::register_module;

mod key_encoder;
use key_encoder::*;

declare_types! {
  pub class JsKeyEncoder for BatchEncoder {
    init(mut _cx){
      Ok(BatchEncoder::new())
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

    method encodeManyAndShuffle(mut cx) {
      // Take the first argument, which must be an array
      let js_arr_handle: Handle<JsArray> = cx.argument(0)?;
      // Convert a JsArray to a Rust Vec
      let vec: Vec<Handle<JsValue>> = js_arr_handle.to_vec(&mut cx)?;

      let key_hex_list : Vec<String> = vec
        .iter()
        .map(|js_value| {
          js_value
            .downcast::<JsString>()
            // If downcast fails, default to using empty string
            .unwrap_or(cx.string(""))
            // Get the value of the unwrapped value
            .value()
        })
        .collect();

      let mut this = cx.this();
      let encoded_keys = {
        let guard = cx.lock();
        let ke = &mut this.borrow_mut(&guard);
        ke.encode_many_and_shuffle(&key_hex_list)
      };

      // Create the JS array
      let js_array = JsArray::new(&mut cx, encoded_keys.len() as u32);
      encoded_keys.iter().enumerate().for_each(|(i, s)| {
        let js_str = cx.string(s);
        let _ = js_array.set(&mut cx, i as u32, js_str);
      });

      Ok(js_array.upcast())
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
