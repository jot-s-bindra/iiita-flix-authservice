# from flask import Flask, request, jsonify
# from erp_client import ERPClient
# import requests
# from flask_cors import CORS

# JWT_SERVICE_URL = "http://localhost:4000/api/auth/token" 

# app = Flask(__name__)

# CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# @app.route('/api/student/details', methods=['POST'])
# def get_student_details():
#     try:
#         data = request.get_json()
        
#         required_fields = ['uid', 'pwd', 'batch']
#         if not all(field in data for field in required_fields):
#             return jsonify({"error": "Missing required fields"}), 400

#         client = ERPClient()
        
#         credentials = {
#             'myBatch': data['batch'],
#             'uid': data['uid'],
#             'pwd': data['pwd'],
#             'norobo': "1"
#         }
        
#         if not client.login(credentials):
#             return jsonify({"status": "error", "message": "Invalid ERP credentials"}), 401
        
#         response = client.session.get(client.base_url)
        
#         courses = client.get_all_courses(response.text)
        
#         if not courses:
#             return jsonify({"status": "error", "message": "Invalid ERP credentials"}), 401
        
#         try:
#             jwt_response = requests.post(JWT_SERVICE_URL, json={"uid": data['uid']})
#             if jwt_response.status_code == 200:
#                 response = jsonify({"status": "success", "message": "Valid ERP credentials"})
#                 response.set_cookie('auth_token', jwt_response.cookies.get('auth_token'), httponly=True, samesite='Lax')
#                 return response
#             else:
#                 return jsonify({"status": "error", "message": "JWT generation failed"}), 500
#         except Exception as e:
#             return jsonify({"error": "JWT service error", "message": str(e)}), 500
        
#     except requests.RequestException as e:
#         return jsonify({"error": "Connection error", "message": str(e)}), 500
        
#     except Exception as e:
#         return jsonify({"error": "Server error", "message": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5112)  
from flask import Flask, request, jsonify
from erp_client import ERPClient
import requests
from flask_cors import CORS

JWT_SERVICE_URL = "http://54.252.9.15:4000/api/auth/token" 

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://54.252.9.15:3000", "http://localhost:3000"])


@app.route('/api/student/details', methods=['POST'])
def get_student_details():
    try:
        data = request.get_json()
        
        required_fields = ['uid', 'pwd', 'batch']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        client = ERPClient()
        
        credentials = {
            'myBatch': data['batch'],
            'uid': data['uid'],
            'pwd': data['pwd'],
            'norobo': "1"
        }
        
        if not client.login(credentials):
            return jsonify({"status": "error", "message": "Invalid ERP credentials"}), 401
        
        response = client.session.get(client.base_url)
        
        courses = client.get_all_courses(response.text)
        
        if not courses:
            return jsonify({"status": "error", "message": "Invalid ERP credentials"}), 401
        
        try:
            jwt_response = requests.post(JWT_SERVICE_URL, json={"uid": data['uid']})
            if jwt_response.status_code == 200:
                response = jsonify({"status": "success", "message": "Valid ERP credentials"})
                response.set_cookie('auth_token', jwt_response.cookies.get('auth_token'), httponly=True, samesite='Lax')
                return response
            else:
                return jsonify({"status": "error", "message": "JWT generation failed"}), 500
        except Exception as e:
            return jsonify({"error": "JWT service error", "message": str(e)}), 500
        
    except requests.RequestException as e:
        return jsonify({"error": "Connection error", "message": str(e)}), 500
        
    except Exception as e:
        return jsonify({"error": "Server error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5112)