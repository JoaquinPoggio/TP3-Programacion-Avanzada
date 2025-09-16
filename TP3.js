//1) Suma de números únicos

function sumUnique(nums) {
const soloNumeros = nums.filter(n => Number.isFinite(n));

  // hice un set para quedarnos con valores unicos
  const unicos = new Set(soloNumeros);

  // Sumamos todos los valores
  let suma = 0;
  for (let valor of unicos) {
    suma += valor;
  }

  return suma;
}

console.log(sumUnique([1,2,2,3]));          // 6
console.log(sumUnique([1,'2',2,3,'a']));    // 6
console.log(sumUnique([10, 10, 20, NaN]));  // 30

//2) Seleccionar propiedades
function pick(obj, keys) {
    const result = {}; 

  for (let key of keys) {
    if (key in obj) {          
      result[key] = obj[key]; 
    }
  }

  return result;
}

console.log(pick({a:1,b:2,c:3}, ['a','c','z']));

//3) Agrupar por clave o función
function groupBy(list, keyOrFn) {
  const result = {};

  for (let item of list) {
    const key = typeof keyOrFn === "function"
      ? keyOrFn(item)
      : item[keyOrFn];


    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
}

console.log(groupBy([{t:'a'},{t:'b'},{t:'a'}], 't'));
console.log(groupBy([6,7,8,9], n => n%2 ? 'impar':'par'));

//4) Ordenar por múltiples campos
function sortByMany(list, specs) {
  const cloned = [...list];

  cloned.sort((a, b) => {
    for (let { key, dir } of specs) {
      const valA = a[key];
      const valB = b[key];

      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return cloned;
}

const users = [
  { Nombre: 'Ana', Apellido: 'Zapata', edad: 30 },
  { Nombre: 'Luis', Apellido: 'Alvarez', edad: 25 },
  { Nombre: 'Marta', Apellido: 'Alvarez', edad: 40 },
  { Nombre: 'Juan', Apellido: 'Zapata',edad: 22 }
];

console.log(sortByMany(users, [
  { key: 'Apellido', dir: 'asc' },
  { key: 'edad', dir: 'desc' }
]));

//5) deepEqual (objetos/arrays simples)
function deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;

    if (typeof a === 'object' && typeof b === 'object') {
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!deepEqual(a[i], b[i])) return false;
            }
            return true;
        }

        if (!Array.isArray(a) && !Array.isArray(b)) {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            if (keysA.length !== keysB.length) return false;
            for (let key of keysA) {
                if (!b.hasOwnProperty(key)) return false;
                if (!deepEqual(a[key], b[key])) return false;
            }
            return true;
        }

        return false;
    }

    return false;
}

console.log(deepEqual({x:[1,2]}, {x:[1,2]})); // Verdadero
console.log(deepEqual({x:1}, {x:'1'}));      // falso
console.log(deepEqual(null, null));          // Verdadero
console.log(deepEqual([1,2,3], [1,2,3]));    // Verdadero
console.log(deepEqual([1,2], [1,2,3]));      // falso

//6) Validador de paréntesis
function isBalanced(s) {
    const stack = [];
    const pairs = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    for (const char of s) {
        if (['(', '[', '{'].includes(char)) {
            stack.push(char); 
        } else if ([')', ']', '}'].includes(char)) {
            if (stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }

    return stack.length === 0;
}

console.log(isBalanced("([]{})")); // Verdadero
console.log(isBalanced("(]"));     // fAlso
console.log(isBalanced("([)]"));   // falso
console.log(isBalanced("{[()]}")); // Verdadero
console.log(isBalanced("((()"));   // falso

//7) Frecuencia de palabras
function wordFreq(text) {
    const cleanText = text.toLowerCase().replace(/[,.!?:;]/g, '');
    const words = cleanText.split(/\s+/);

    const freqMap = new Map();

    for (const word of words) {
        if (!word) continue;
        freqMap.set(word, (freqMap.get(word) || 0) + 1);
    }

    return freqMap;
}

const text = "Hola, hola! chau.";
const result = wordFreq(text);
console.log(result);

//9) Debounce
function debounce(fn, delay) {
    let timerId;

    return function(...args) {
        const context = this;

        if (timerId) clearTimeout(timerId);

        timerId = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}

const log = (msg) => console.log(msg);
const debouncedLog = debounce(log, 500);

debouncedLog("Hola");
debouncedLog("Mundo");

//10) Asincronismo: withTimeout + allSettledLite
//A)
function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), ms);
    });

    return Promise.race([promise, timeout]);
}

const p = new Promise(resolve => setTimeout(() => resolve("ok"), 2000));
withTimeout(p, 1000).catch(err => console.log(err.message));

//B)
function allSettledLite(promises) {
    return Promise.all(promises.map(p =>
        p
        .then(value => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected', reason }))
    ));
}

const ok = () => Promise.resolve(42);
const fail = () => Promise.reject("error");

allSettledLite([ok(), fail()]).then(console.log);




