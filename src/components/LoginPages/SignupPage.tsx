import React, { FormEvent, FormEventHandler, MouseEventHandler, useEffect, useMemo, useRef } from "react";
import {  Link, useNavigate } from "react-router-dom";
import './Form.scss';
import '../../App.css';
import { useSelector } from "react-redux";
import { getUserInfo } from "../../redux/userReducer";
import socket from "../../socket/socket";
import { User } from "../../redux/entities/user";
import { login as loginFunc } from "../../socket/socket";

const SignupPage = () => {

    const navigate = useNavigate();
    const user = useSelector(getUserInfo)

    useEffect(() =>{
        if(user){
        return navigate("/");
        }},[user]);

    const signup = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        let form = e.target as HTMLFormElement;

        socket.on('user.userCreated',({name,login}:User&{login:string}) =>{
            loginFunc(form['login'].value,form['password'].value);
        });

        socket.emit('users.signup',
            form['username'].value,
            form['login'].value,
            form['password'].value
        );
    };

    // const signupForm = useRef();

    return <div className="page">
        <form className="form" onSubmit={signup}>
            <div className="form__desc">
                <span className="form__title">Создать учётную запись</span>
            </div>
            <div className="form__content">
                <div className="form__field">
                    <span className="field__title">Отображаемое имя</span>
                    <input name="username" type="text" className="field__input" />
                </div>
                <div className="form__field">
                    <span className="field__title">Логин</span>
                    <input name="login" type="text" className="field__input" />
                </div>
                <div className="form__field">
                    <span className="field__title">Пароль</span>
                    <input name="password" type="password" className="field__input" />
                </div>
            </div>
            <button className="form__confirm" type="submit">Зарегистрироваться</button>
            <Link to={"/login"} className="form__small-text" >Уже зарегистрированы? <b>Войти</b></Link>
        </form>
    </div>
};

export default SignupPage