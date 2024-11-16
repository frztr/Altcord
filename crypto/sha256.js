function int_to_binary(int, min_size) {
    return int.toString(2).padStart(min_size, '0');
}

function binary_to_int(bin) {
    return parseInt(bin, 2);
}

function rotateRight(str, number) {
    str = int_to_binary(str, 32);
    for (let i = 0; i < number; i++) {
        let all, last;
        str = [...str].reverse();
        [last, ...all] = [...str];
        str = [...all, last];
        str.reverse();
    }
    return binary_to_int([...str].reduce((prev, next) => prev.concat(next)));
}

function shiftRight(str, number) {
    return str >>> number;
}

function scheduling(block, chunk_index) {
    let mes_schedule = [];
    for (let i = 0; i < 64; i++) {
        mes_schedule[i] = 0;
        if (i < 16) {
            mes_schedule[i] = block[i + chunk_index * 16];
        }
    }

    let i = 16;
    for (let i = 16; i < 64; i++) {
        let word = mes_schedule[i - 15];

        let x1 = BigInt(rotateRight(word, 7));
        let x2 = BigInt(rotateRight(word, 18));
        let x3 = BigInt(shiftRight(word, 3));
        let a0 = x1 ^ x2 ^ x3;

        word = mes_schedule[i - 2];
        let y1 = BigInt(rotateRight(word, 17));
        let y2 = BigInt(rotateRight(word, 19));
        let y3 = BigInt(shiftRight(word, 10));
        let a1 = y1 ^ y2 ^ y3;

        let f = BigInt(mes_schedule[i - 16]);
        let th = BigInt(mes_schedule[i - 7]);
        let res = int_to_binary(a0 + a1 + f + th);
        res = res.substring(res.length - 32, res.length).padStart(32, '0');
        mes_schedule[i] = binary_to_int(res);
    }
    return mes_schedule;
}

export default function SHA256(str) {
    let block = init_mes(str);
    let k_const = init_k_constants();
    let chunk_count = block.length / 16;
    let vector = init_working_variables();

    for (let chunk = 0; chunk < chunk_count; chunk++) {
        let words = scheduling(block, chunk);
        let inits = vector;
        for (let i = 0; i < 64; i++) {
            vector = Update(vector, k_const[i], words[i]);

        }
        
        Object.keys(vector).map((x) => {
            vector[x] = cutTo32(vector[x] + inits[x])
        });
    }


    let hash = "";
    Object.keys(vector).map((x) => {
        hash += vector[x].toString(16).padStart(8,'0');
    });
    // console.log(hash);
    return hash;
}

function cutTo32(value) {
    let val = int_to_binary(value, 32);
    return binary_to_int(val.substring(val.length - 32, val.length));
}

function Update({ a, b, c, d, e, f, g, h }, k_const, word) {

    let e1 = BigInt(rotateRight(e, 6));
    let e2 = BigInt(rotateRight(e, 11));
    let e3 = BigInt(rotateRight(e, 25));
    let a1 = BigInt(rotateRight(a, 2));
    let a2 = BigInt(rotateRight(a, 13));
    let a3 = BigInt(rotateRight(a, 22));

    let sum1 = e1 ^ e2 ^ e3;
    let sum0 = a1 ^ a2 ^ a3;
    let Choice = (BigInt(e) & BigInt(f)) ^ (BigInt(~e) & BigInt(g));
    let Majority = BigInt(a) & BigInt(b) ^ BigInt(a) & BigInt(c) ^ BigInt(b) & BigInt(c);

    let Temp2 = cutTo32(sum0 + Majority);

    let Temp1 = cutTo32(BigInt(h) + BigInt(sum1) + BigInt(Choice) + BigInt(k_const) + BigInt(word));

    h = g;
    g = f;
    f = e;
    e = cutTo32(d + Temp1);
    d = c;
    c = b;
    b = a;
    a = cutTo32(Temp1 + Temp2);

    let ret_vect = { a, b, c, d, e, f, g, h };
    // console.log({
    //     ret_vect:{a: int_to_binary(ret_vect.a)},
    //     k_const,
    //     word,
    //     Temp1: Temp1,
    //     Temp2: Temp2,
    //     sum0:sum0.toString(2),
    //     sum1,
    //     Majority,
    //     e1,
    //     e2,
    //     e3,
    //     a1,
    //     a2,
    //     a3
    // });
    return ret_vect;
}

function get_fractional_bits(number) {
    return binary_to_int(number.toString(2).split('.')[1].substring(0, 32));
}

function init_working_variables() {
    return {
        a: get_fractional_bits(Math.sqrt(2)),
        b: get_fractional_bits(Math.sqrt(3)),
        c: get_fractional_bits(Math.sqrt(5)),
        d: get_fractional_bits(Math.sqrt(7)),
        e: get_fractional_bits(Math.sqrt(11)),
        f: get_fractional_bits(Math.sqrt(13)),
        g: get_fractional_bits(Math.sqrt(17)),
        h: get_fractional_bits(Math.sqrt(19)),
    };
}

function isSimple(number) {
    for (let i = 2; i < number; i++) {
        if (number % i == 0) return false;
    }
    return true;
}

function init_k_constants() {
    let count = 0;
    let num = 2;
    let k_const = [];
    while (count < 64) {
        if (isSimple(num)) {
            count++;
            k_const = [...k_const, get_fractional_bits(Math.pow(num, 1 / 3))];
        }
        num++;
    }
    return k_const;
}

function init_mes(str) {
    let block = [];

    for (let i = 0; i < str.length; i++) {
        block[i] = [...int_to_binary(str.charCodeAt(i), 8)];
    }


    block = block.reduce((prev, x) => [...prev, ...x]);
    block[block.length] = 1;

    let mes_len = block.length - 1;
    let k = block.length + 64;
    let block_count = Math.floor(k / 512) + 1;
    let message_size = block_count * 512;
    let zeros_count = message_size - k;
    for (let i = 0; i < zeros_count; i++) {
        block[block.length] = 0;
    }

    let block_end = mes_len.toString(2).padStart(64, '0');
    for (let i = 0; i < block_end.length; i++) {
        block[block.length] = block_end[i];
    }

    block = block.reduce((pr, c) => {
        return pr += c;
    });

    let ar = [];
    for (let i = 0; i < block.length; i = i + 32) {
        ar[ar.length] = binary_to_int(block.substring(i, i + 32));
    }

    return ar;
}

function print_block64word(block) {
    for (let i = 0; i < block.length; i++) {
        console.log(int_to_binary(block[i], 32));
    }
}
