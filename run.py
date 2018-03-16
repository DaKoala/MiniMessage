from __init__ import app
import sys

if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise ValueError("Please input exactly 1 argument!(Input 0 for test mode)")
    if sys.argv[1] == '0':
        TEST = True
    else:
        TEST = False

    # For test
    if TEST:
        app.debug = True
        app.run(host="127.0.0.1", port=5000)

    # On server
    else:
        app.run(host="0.0.0.0", port=80)
