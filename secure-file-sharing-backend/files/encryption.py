from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import os

class FileEncryption:
    def __init__(self, key):
        self.key = key

    def encrypt(self, plaintext):
        iv = os.urandom(16)
        cipher = Cipher(algorithms.AES(self.key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        padder = padding.PKCS7(algorithms.AES.block_size).padder()
        padded_data = padder.update(plaintext) + padder.finalize()
        ciphertext = encryptor.update(padded_data) + encryptor.finalize()
        return iv + ciphertext

    def decrypt(self, ciphertext):
        iv = ciphertext[:16]
        cipher = Cipher(algorithms.AES(self.key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        decrypted_data = decryptor.update(ciphertext[16:]) + decryptor.finalize()
        return unpadder.update(decrypted_data) + unpadder.finalize()
