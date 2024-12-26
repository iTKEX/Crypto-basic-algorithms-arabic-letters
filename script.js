// Hardcoded Arabic alphabet
const arabicAlphabet = "ابتثجحخدذرزسشصضطظعغفقكلمنهويأإآءةؤىئ";

// Function to perform the Shift Cipher using Arabic alphabet
function shiftCipher(text, shift) {
    const alphabetLength = arabicAlphabet.length;
    return text.split('').map(char => {
        const index = arabicAlphabet.indexOf(char);
        if (index !== -1) {
            // Calculate the new index with the shift
            const newIndex = (index + shift + alphabetLength) % alphabetLength;
            return arabicAlphabet[newIndex];
        }
        return char; // Non-Arabic characters remain unchanged
    }).join('');
}

// Monoalphabetic Cipher function using a custom Arabic alphabet from the key field
function monoalphabeticCipher(text, key) {
    // Ensure custom alphabet is valid
    if (key.length !== arabicAlphabet.length) {
        return "Error: Custom alphabet must have the same length as the Arabic alphabet.";
    }

    // Create a mapping from each letter in the original Arabic alphabet to the custom alphabet
    const cipherMap = {};
    for (let i = 0; i < arabicAlphabet.length; i++) {
        cipherMap[arabicAlphabet[i]] = key[i];
    }

    // Encrypt the plaintext using the custom alphabet mapping
    return text.split('').map(char => cipherMap[char] || char).join('');
}

// Vigenere Cipher function using Arabic alphabet
function vigenereCipher(text, key) {
    let ciphertext = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (arabicAlphabet.includes(char)) { // Only encrypt Arabic characters
            let textIndex = arabicAlphabet.indexOf(char);
            let keyChar = key[keyIndex % key.length];
            let keyIndexInAlphabet = arabicAlphabet.indexOf(keyChar);

            // Perform the shift using the Arabic alphabet
            let cipherIndex = (textIndex + keyIndexInAlphabet) % arabicAlphabet.length;
            let cipherChar = arabicAlphabet[cipherIndex];

            ciphertext += cipherChar;
            keyIndex++;
        } else {
            ciphertext += char; // Non-Arabic characters remain unchanged
        }
    }

    return ciphertext;
}

// Function to encrypt the message using the Rail Fence cipher
function railFenceCipher(text, key) {
    // Create the matrix to cipher plain text
    let rail = new Array(key).fill().map(() => new Array(text.length).fill('\n'));
  
    // Filling the rail matrix to distinguish filled spaces from blank ones
    let dir_down = false;
    let row = 0, col = 0;
  
    for (let i = 0; i < text.length; i++) {
      // Check if the character is in the Arabic alphabet
      if (arabicAlphabet.includes(text[i])) {
        // Check the direction of flow and reverse if we've just filled the top or bottom rail
        if (row === 0 || row === key - 1) dir_down = !dir_down;
  
        // Fill the corresponding alphabet
        rail[row][col++] = text[i];
  
        // Find the next row using direction flag
        dir_down ? row++ : row--;
      }
    }
  
    // Now we can construct the cipher using the rail matrix
    let result = '';
    for (let i = 0; i < key; i++)
      for (let j = 0; j < text.length; j++)
        if (rail[i][j] !== '\n') result += rail[i][j];
  
    return result;
  }  

  
  // Function to get the index of a character in the Arabic alphabet
function getIndex(char) {
    return arabicAlphabet.indexOf(char);
}

function rowTranspositionCipher(text, key) {
    // Remove spaces from the message
    text = text.replace(/\s+/g, ''); // Removes all whitespace characters

    const msgLength = text.length;
    const keyLength = key.length;

    // Create a matrix to hold the characters
    const matrix = [];

    // Fill the matrix with the message
    for (let i = 0; i < msgLength; i += keyLength) {
        const row = text.slice(i, i + keyLength);
        matrix.push(row);
    }

    // Get indices for the sorted order of the key based on the Arabic alphabet
    const sortedKey = Array.from(key)
        .map((char, index) => ({ index: getIndex(char), originalIndex: index }))
        .sort((a, b) => a.index - b.index);

    // Read the matrix in column order according to sorted key
    let cipher = '';
    for (let i = 0; i < keyLength; i++) {
        const colIndex = sortedKey[i].originalIndex;
        for (const row of matrix) {
            if (row[colIndex]) { // Check if the character exists
                cipher += row[colIndex];
            }
        }
    }

    return cipher;
}

// Encryption function for Double Transposition Cipher
function doubleTranspositionCipher(text, keysInput) {
    // Split the keys input into an array and trim spaces
    const keys = keysInput.split(' ').map(key => key.trim());

    // Check that exactly two keys are provided
    if (keys.length !== 2) {
        throw new Error("Please provide exactly two keys separated by a space.");
    }

    // First encryption using the first key
    const firstCipher = rowTranspositionCipher(text, keys[0]);
    // Second encryption using the second key
    const finalCipher = rowTranspositionCipher(firstCipher, keys[1]);
    return finalCipher;
}

// Encryption function to select and perform encryption based on cipher type
function encryption() {
    // Retrieve values from HTML elements
    const cipherType = document.getElementById('cipher-select').value;
    const plaintext = document.getElementById('plaintext').value;
    const key = document.getElementById('key').value; // Get the key as text

    // Perform encryption based on selected cipher type
    let encryptedText = "";
    if (cipherType === "Shift-cipher" && !isNaN(parseInt(key))) {
        encryptedText = shiftCipher(plaintext, parseInt(key)); // Shift cipher with numeric key
    } else if (cipherType === "Monoalphabetic-cipher") {
        encryptedText = monoalphabeticCipher(plaintext, key); // Monoalphabetic cipher with custom alphabet key
    } else if (cipherType === "Vigenere") {
        encryptedText = vigenereCipher(plaintext, key); // Vigenere cipher with provided key
    } else if (cipherType === "Rail-Fence") {
        encryptedText = railFenceCipher(plaintext, parseInt(key)); // Rail Fence cipher with row count
    } else if (cipherType === "Row-Transposition") {
        encryptedText = rowTranspositionCipher(plaintext, key); // Row Transposition cipher with key
    } else if (cipherType === "Double-Transposition") {
        encryptedText = doubleTranspositionCipher(plaintext, key); // Row Transposition cipher with key
    }  else {
        encryptedText = "Please select a valid cipher and enter a suitable key.";
    }

    // Display the encrypted text in the ciphertext field
    document.getElementById('ciphertext').value = encryptedText;
}

//------------------Decryption--------------------------------
//-----------------------------------------------------------
//------------------------------------------------------------


// Function to perform the Shift Cipher decryption using Arabic alphabet
function shiftCipherDecrypt(text, shift) {
    return shiftCipher(text, -shift); // Decrypt by shifting in the opposite direction
}

// Monoalphabetic Cipher decryption function using a custom Arabic alphabet from the key field
function monoalphabeticCipherDecrypt(text, key) {
    // Ensure custom alphabet is valid
    if (key.length !== arabicAlphabet.length) {
        return "Error: Custom alphabet must have the same length as the Arabic alphabet.";
    }

    // Create a reverse mapping from the custom alphabet back to the original Arabic alphabet
    const cipherMap = {};
    for (let i = 0; i < arabicAlphabet.length; i++) {
        cipherMap[key[i]] = arabicAlphabet[i];
    }

    // Decrypt the ciphertext using the reverse mapping
    return text.split('').map(char => cipherMap[char] || char).join('');
}

// Vigenere Cipher decryption function using Arabic alphabet
function vigenereCipherDecrypt(text, key) {
    let plaintext = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (arabicAlphabet.includes(char)) { // Only decrypt Arabic characters
            let textIndex = arabicAlphabet.indexOf(char);
            let keyChar = key[keyIndex % key.length];
            let keyIndexInAlphabet = arabicAlphabet.indexOf(keyChar);

            // Perform the reverse shift using the Arabic alphabet
            let plainIndex = (textIndex - keyIndexInAlphabet + arabicAlphabet.length) % arabicAlphabet.length;
            let plainChar = arabicAlphabet[plainIndex];

            plaintext += plainChar;
            keyIndex++;
        } else {
            plaintext += char; // Non-Arabic characters remain unchanged
        }
    }

    return plaintext;
}

// Function to decrypt a message
function railFenceCipherDecrypt(cipher, key) {
    // Create the matrix to mark the places with '*'
    let rail = new Array(key).fill().map(() => new Array(cipher.length).fill('\n'));
  
    // Filling the rail matrix
    let dir_down = false;
    let row = 0, col = 0;
  
    for (let i = 0; i < cipher.length; i++) {
      // Check the direction of flow
      if (row === 0) dir_down = true;
      if (row === key - 1) dir_down = false;
  
      // Place the marker
      rail[row][col++] = '*';
  
      // Find the next row using direction flag
      dir_down ? row++ : row--;
    }
  
    // Now we can construct the rail matrix by filling the marked places with cipher text
    let index = 0;
    for (let i = 0; i < key; i++)
      for (let j = 0; j < cipher.length; j++)
        if (rail[i][j] === '*' && index < cipher.length) rail[i][j] = cipher[index++];
  
    // Now read the matrix in zig-zag manner to construct the resultant text
    let result = '';
    row = 0, col = 0;
    for (let i = 0; i < cipher.length; i++) {
      // Check the direction of flow
      if (row === 0) dir_down = true;
      if (row === key - 1) dir_down = false;
  
      // Add to result if not a marker
      if (rail[row][col] !== '*') result += rail[row][col++];
  
      // Find the next row using direction flag
      dir_down ? row++ : row--;
    }
  
    return result;
  }

 // Function to decrypt a message using Row Transposition Cipher with Arabic alphabet
function rowTranspositionCipherDecrypt(cipher, key) {
    const keyLength = key.length;
    const numRows = Math.ceil(cipher.length / keyLength);
    
    // Create a matrix to hold the decrypted characters
    const matrix = Array.from({ length: numRows }, () => Array(keyLength).fill(null));
    
    // Get indices for the sorted order of the key based on the Arabic alphabet
    const sortedKey = Array.from(key)
        .map((char, index) => ({ index: getIndex(char), originalIndex: index }))
        .sort((a, b) => a.index - b.index);
    
    let cipherIndex = 0;

    // Fill the matrix based on the order determined by the key
    for (let i = 0; i < keyLength; i++) {
        const colIndex = sortedKey[i].originalIndex;
        for (let j = 0; j < numRows; j++) {
            if (cipherIndex < cipher.length) {
                matrix[j][colIndex] = cipher[cipherIndex++];
            }
        }
    }

    // Read the matrix row-wise to construct the decrypted message
    let msg = '';
    for (const row of matrix) {
        msg += row.join('');
    }

    return msg;
}

// Function to perform Double Transposition Cipher decryption
function doubleTranspositionCipherDecrypt(cipher, keysInput) {
    // Split the keys input into an array and trim spaces
    const keys = keysInput.split(' ').map(key => key.trim());

    // First decryption using the second key
    const firstDecrypted = rowTranspositionCipherDecrypt(cipher, keys[1]);
    // Second decryption using the first key
    const finalDecrypted = rowTranspositionCipherDecrypt(firstDecrypted, keys[0]);
    return finalDecrypted;
}


// Decryption function to select and perform decryption based on cipher type
function decryption() {
    // Retrieve values from HTML elements
    const cipherType = document.getElementById('cipher-select').value;
    const ciphertext = document.getElementById('ciphertext').value;
    const key = document.getElementById('key').value; // Get the key as text

    // Perform decryption based on selected cipher type
    let decryptedText = "";
    if (cipherType === "Shift-cipher" && !isNaN(parseInt(key))) {
        decryptedText = shiftCipherDecrypt(ciphertext, parseInt(key)); // Shift cipher with numeric key
    } else if (cipherType === "Monoalphabetic-cipher") {
        decryptedText = monoalphabeticCipherDecrypt(ciphertext, key); // Monoalphabetic cipher with custom alphabet key
    } else if (cipherType === "Vigenere") {
        decryptedText = vigenereCipherDecrypt(ciphertext, key); // Vigenere cipher with provided key
    } else if (cipherType === "Rail-Fence") {
        decryptedText = railFenceCipherDecrypt(ciphertext, parseInt(key)); // Rail Fence cipher with row count
    } else if (cipherType === "Row-Transposition") {
        decryptedText = rowTranspositionCipherDecrypt(ciphertext, key); // Row Transposition cipher with key
    } else if (cipherType === "Double-Transposition") {
        decryptedText = doubleTranspositionCipherDecrypt(ciphertext, key); // Row Transposition cipher with key
    } else {
        decryptedText = "Please select a valid cipher and enter a suitable key.";
    }

    // Display the decrypted text in the plaintext field
    document.getElementById('plaintext').value = decryptedText;
}