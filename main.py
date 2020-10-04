from flask import Flask, redirect, url_for, render_template, request, session
import sqlite3
import random

app = Flask(__name__)
app.secret_key = "Testing"


@app.route("/", methods=["POST", "GET"])
def home():
    db = sqlite3.connect('stellar.db')
    cursor = db.cursor()
    cursor.execute("SELECT * FROM account_data")
    result = cursor.fetchall()
    cursor.execute("SELECT * FROM planet_data")
    result1 = cursor.fetchall()
    
    cursor.close()
    db.close()
    if request.method == "POST":
        return render_template("index.html", data=result, pdata=result1)
    else:
        if "email" in session:
            return render_template("index.html", data=result, pdata=result1, email=session["email"], username=session["user"])
        else:
            return render_template("index.html", data=result, pdata=result1)

@app.route("/planet/")
def planet():
    return render_template("planet.html")

@app.route("/planet/<planet_id>/")
def planet_view(planet_id):
    print(planet_id)
    db = sqlite3.connect('stellar.db')
    cursor = db.cursor()
    cursor.execute("SELECT * FROM planet_data WHERE planetID = '{}'".format(planet_id))
    result = cursor.fetchone()
    planet = { "planetName" : result[1],
               "planetDescription" : result[2],
               "planetAuthor" : result[3],
               "publishDate" : result[4],
               "planetColor" : result[7],
               "planetTerrainImg" : result[5],
               "planetImg" : result[6],
               "planetSize" : result[8],
               "planetRoughness" : result[9],
               "planetContour" : result[10],
               "planetReflectiveness" : result[11],
               "planetSpeed" : result[12],
               "atmosphereColor" : result[13],
               "atmosphereDepth" : result[14],
               "atmosphereSpeed" : result[16],
               "atmosphereAura" : result[17],
               "atmosphereImg" : result[18],
               "atmosphereOpacity" : result[15]}
    return render_template("viewplanet.html", planet=planet)

@app.route("/planet/submit/", methods=["POST", "GET"])
def planet_submit():
    if request.method == "POST":
        print(request.json)
        planetName = request.json['planetName']
        planetDescription = request.json['planetDescription']
        publishDate = request.json['publishDate']
        planetColor = request.json['planetColor']
        planetTerrainImg = request.json['planetTerrainImg']
        planetImg = request.json['planetImg']
        planetSize = request.json['planetSize']
        planetRoughness = request.json['planetRoughness']
        planetContour = request.json['planetContour']
        planetReflectiveness = request.json['planetReflectiveness']
        planetSpeed = request.json['planetSpeed']
        atmosphereColor = request.json['atmosphereColor']
        atmosphereDepth = request.json['atmosphereDepth']
        atmosphereSpeed = request.json['atmosphereSpeed']
        atmosphereAura = request.json['atmosphereAura']
        atmosphereImg = request.json['atmosphereImg']
        atmosphereOpacity = request.json['atmosphereOpacity']
        db = sqlite3.connect('stellar.db')
        cursor = db.cursor()
        cursor.execute("SELECT * FROM account_data WHERE email = '{}'".format(session["email"]))
        result = cursor.fetchone()
        planetID = random.randint(1111,9999)
        sql = ("INSERT INTO planet_data(planetID, planetName, planetDescription, planetAuthor, publishDate, planetColor, planetTerrainImg, planetImg, planetSize, planetRoughness, planetContour, planetReflectiveness, planetSpeed, atmosphereColor, atmosphereDepth, atmosphereSpeed, atmosphereAura, atmosphereImg, systemID, atmosphereOpacity) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
        val = (planetID, planetName, planetDescription, session["user"], publishDate, planetColor, planetTerrainImg, planetImg, planetSize, planetRoughness, planetContour, planetReflectiveness, planetSpeed, atmosphereColor, atmosphereDepth, atmosphereSpeed, atmosphereAura, atmosphereImg, result[5], atmosphereOpacity)
        cursor.execute(sql, val)
        db.commit()
        cursor.execute("SELECT * FROM account_data WHERE email = '{}'".format(session["email"]))
        result = cursor.fetchone()
        sql = ("UPDATE account_data SET total_planets = ? WHERE email = ?")
        val = (result[6] + 1, session["email"])
        cursor.execute(sql, val)
        db.commit()
        cursor.close()
        db.close()
        return redirect(url_for("home"))

@app.route("/login/", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        em = request.form['lem']
        pas = request.form['lpas']
        db = sqlite3.connect('stellar.db')
        cursor = db.cursor()
        cursor.execute("SELECT email, username, password FROM account_data WHERE email = '{}'".format(em))
        result = cursor.fetchone()
        if result is None:
            return redirect(url_for("signup"))
        elif str(pas) != str(result[2]):
            return redirect(url_for("login"))
        else:
            session["user"] = str(result[1])
            session["email"] = str(result[0])
            return redirect(url_for("home"))
    else:
        if "user" in session:
            return redirect(url_for("home"))
        return render_template("login.html")

@app.route("/user/")
def user():
    if "user" in session:
        user = session["user"]
        return f"<h1>{user}</h1>"
    else:
        return render_template("index.html")

@app.route("/signup/", methods=["POST", "GET"])
def signup():
    if request.method == "POST":
        pas = request.form['pas']
        pasc = request.form['pasc']
        email = request.form['em']
        usr = request.form['usr']
        db = sqlite3.connect('stellar.db')
        cursor = db.cursor()
        cursor.execute("SELECT email FROM account_data WHERE email = '{}'".format(email))
        result = cursor.fetchone()
        if result is not None:
            return redirect(url_for("login"))
        elif pas == pasc:
            systemID = random.randint(1111,9999)
            sql = ("INSERT INTO account_data(email, password, username, total_planets, system_id) VALUES(?,?,?,?,?)")
            val = (str(email), str(pas), str(usr), 0, systemID)
            cursor.execute(sql, val)
            db.commit()
            session["user"] = usr
            session["email"] = email
            return redirect(url_for("login"))
        else:
            return render_template("signup.html")
        cursor.close()
        db.close()
    else:
        return render_template("signup.html")

@app.route("/account/", methods=["POST", "GET"])
def account():
    if request.method == "POST":
        return render_template("index.html")
    else:
        if "email" in session:
            return render_template("account.html", email=session["email"], username=session["user"])
        else:
            return render_template("index.html")

@app.route("/logout/")
def logout():
    session.pop("user", None)
    session.pop("email", None)
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)