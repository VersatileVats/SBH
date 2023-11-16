let NODE_SERVER_URL = "http://server-chamanrock-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com/"
let ML_MODEL_URL = "https://ml-model-chamanrock-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com/"

NODE_SERVER_URL = (NODE_SERVER_URL[NODE_SERVER_URL.length - 1] == '/') ? NODE_SERVER_URL.slice(0, NODE_SERVER_URL.length - 1) : NODE_SERVER_URL
ML_MODEL_URL = (ML_MODEL_URL[ML_MODEL_URL.length - 1] == '/') ? ML_MODEL_URL.slice(0, ML_MODEL_URL.length - 1) : NODE_SERVER_URL