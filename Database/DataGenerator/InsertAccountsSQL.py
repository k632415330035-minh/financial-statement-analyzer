import random
with open("./insertAccountsSQL.sql", "w", encoding="utf-8") as f, open("./CCCD/cccd.txt", "r", encoding="utf-8") as g:
    for i in range(50):
        cccd = g.readline().strip()
        sql = f"INSERT INTO accounts VALUES ('{cccd}', '123456', 'cu dan');\n"
        f.write(sql)
////////////////////aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

