"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
from werkzeug.security import generate_password_hash,check_password_hash
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime,timedelta

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/register", methods=["POST"])
def register():
    print("Recibida solicitud a /register")
    try:
        data=request.get_json()
        full_name=data.get("full_name")
        email=data.get("email")
        password=data.get("password")

        if not full_name or not email or not password:
            return jsonify({"error":"Todos los campos son obligatorios"}),400
        
        if len (password)<6:
            return jsonify({"error":"La contraseña debe tener al menos 6 caracteres"}),400

        if User.query.filter_by(email=email).first():
            return jsonify({"msg":"El correo ya esta registrado"}),400
        
        new_user=User(full_name=full_name,email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        access_token=create_access_token(identity=new_user.id,expires_delta=timedelta(hours=1))

        return jsonify({"msg":"Registro exitoso","token":access_token,"user":new_user.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error"})
    
@api.route("/login",methods=["POST"])
def login():
    data=request.get_json()
    email=data.get("email")
    password=data.get("password")

    user=User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error":"Credenciales incorrectas"}),401
    
    access_token=create_access_token(identity=user.id,expires_delta=timedelta(hours=1))
    return jsonify({"token":access_token,"user":user.serialize()}),200

@api.route("/users", methods=["GET"])
@jwt_required()
def list_user():
    users=User.query.all()
    user_list=[{"full_name":u.full_name,"email":u.email}for u in users]
    return jsonify(user_list),200

@api.route("/profile",methods=["PUT"])
@jwt_required()
def edit_profile():
    user_id=get_jwt_identity()
    user=User.query.get(user_id)
    if not user:
        return jsonify({"error":"Usuario no encontrado"}),404
    
    data=request.get_json()
    full_name=data.get("full_name")
    current_password=data.get("current_password")
    new_password=data.get("new_password")

    if full_name:
        user.full_name=full_name

    if new_password:
        if not current_password:
            return jsonify({"error":"Se requiere la contraseña actual"}),400
        if not user.check_password(current_password):
            return jsonify({"error":"Contraseña actual incorrecta"}),401
        if len(new_password)<6:
            return jsonify ({"error":"La nueva contraseña debe tener minimo 6 caracteres"}),400
        
        user.set_password(new_password)

    db.session.commit()
    return jsonify({"msg":"Perfil actualizado", "user":{"id":user.id,"full_name":user.full_name,"email":user.email}}),200    

@api.route("/delete_account",methods=["DELETE"])
@jwt_required()
def delete_account():
    user_id=get_jwt_identity()
    user=User.query.get(user_id)

    if not user:
        return jsonify({"error":"Usuario no encontrado"}),400
    
    data=request.get_json()
    password=data.get("password")
    confirm_delete=data.get("confirm_delete")

    if not confirm_delete:
        return jsonify ({"error": "Se requiere confirmacion para eliminar la cuenta"}),400
    if not user.check_password(password):
        return jsonify({"error":"Contraseña incorrecta"}),401
    
    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg":"Cuenta eliminada"}),200