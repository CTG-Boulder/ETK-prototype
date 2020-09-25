'use strict'

const fs = require('fs')
const http = require('http')

function toHexString(byteArray) {
    const chars = new Uint8Array(byteArray.length * 2);
    const alpha = 'a'.charCodeAt(0) - 10;
    const digit = '0'.charCodeAt(0);
  
    let p = 0;
    for (let i = 0; i < byteArray.length; i++) {
        let nibble = byteArray[i] >>> 4;
        chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
        nibble = byteArray[i] & 0xF;
        chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;    
    }
    return String.fromCharCode.apply(null, chars);
  }

const args = process.argv.slice(2);

if (args.length < 1) {
    console.log("need a file to process");
    process.exit(1);
}

console.log("processing file: " + args[0]);

let rawdata = fs.readFileSync(args[0]);
let result = JSON.parse(rawdata);

let sent_entries = {};

// need to send each request and wait to avoid overloading the server
(async function() {
for (var entry of result.encounters) {
    if (sent_entries[entry.clientKey] && sent_entries[entry.clientKey][entry.timestamp]) {
        console.log(`skipping duplicate ${entry.clientKey} at ${entry.timestamp}`);
        continue;
    }    
    let mac = entry._meta.mac;
    if (Array.isArray(mac)) {
        mac = toHexString(mac);
    }

    let submission = { encounters: [{
        status: entry.status,
        clientKey: entry.clientKey,
        timestamp: entry.timestamp,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        _meta: {
            mac: mac,
            rssi_values: entry._meta.rssi_values,
            usound_data: entry._meta.usound_data
        }
    }]};
    let data = JSON.stringify(submission);
    const options = {
        hostname: 'localhost',
        port: 8000,
        path: '/api/encounters/debug',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
    };

    try {
        let http_promise = createHttpRequestPromise(options, data);
        // wait to http request to finish
        let response = await http_promise;
        console.log(response);
        if (sent_entries[entry.clientKey] == undefined) {
            sent_entries[entry.clientKey] = {};
        }
        sent_entries[entry.clientKey][entry.timestamp] = 1;
    } catch(error) {
        console.log(`error while sending data: ${data}`);
        console.log(error);
        process.exit(1);
    }
/*
    //options.headers['Content-Length'] = data.length;
    const req = http.request(options, res => {
        if (res.statusCode != 200) {
            console.log(`statusCode: ${res.statusCode}`);
            res.on('data', d => {
                process.stdout.write(d)
            });
        }
    });
    req.on('error', error => {
        console.error(error);
    });
    req.write(data);
    req.end();
    break;
*/
}
})();


// function returns a Promise
function createHttpRequestPromise(options, data) {
	return new Promise((resolve, reject) => {
		const request = http.request(options, (response) => {
			let chunks_of_data = [];

			response.on('data', (fragments) => {
				chunks_of_data.push(fragments);
			});
			response.on('end', () => {
                let response_body = Buffer.concat(chunks_of_data);
                if (response.statusCode >=200 && response.statusCode < 300) {
                    resolve(response_body.toString());
                } else {
                    reject(new Error(response_body.toString()));
                }
			});
        });
        request.on('error', error => {
            reject(new Error(error));
        });
        request.write(data);
        request.end();
	});
}

