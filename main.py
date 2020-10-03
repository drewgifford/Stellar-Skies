from flask import Flask, redirect, url_for, render_template, request, session
import sqlite3

app = Flask(__name__)
app.secret_key = "Testing"


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login", methods=["POST", "GET"])
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
            return redirect(url_for("user"))
    else:
        if "user" in session:
            return redirect(url_for("user"))
        return render_template("login.html")

@app.route("/user")
def user():
    if "user" in session:
        user = session["user"]
        return f"<h1>{user}</h1>"
    else:
        return render_template("index.html")

@app.route("/signup", methods=["POST", "GET"])
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
            sql = ("INSERT INTO account_data(email, password, username) VALUES(?,?,?)")
            val = (str(email), str(pas), str(usr))
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

@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)