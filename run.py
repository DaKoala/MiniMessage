from __init__ import app

TEST = True

if __name__ == "__main__":
    # For test
    if TEST:
        app.debug = True
        app.run(host="127.0.0.1", port=5000)

    # On server
    else:
        app.run(host="0.0.0.0", port=80)
