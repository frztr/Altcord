import React, { FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Form.scss';
import '../../App.css';
import { useSelector } from "react-redux";
import { getUserInfo } from "../../redux/userReducer";
import socket from "../../socket/socket";
import { login } from "../../socket/socket";

const LoginPage = () => {

    const navigate = useNavigate();
    const user = useSelector(getUserInfo)

    useEffect(() =>{
        if(user){
        return navigate("/");
        }},[user]);

    let formSubmit = (e:FormEvent<HTMLFormElement>) =>{
        
        e.preventDefault();
        let form = e.target as HTMLFormElement;
        // console.log({login: form['login'].value, password: form['password'].value });
        login(form['login'].value,form['password'].value);
    };

    return <div className="page">
        <form className="form" onSubmit={formSubmit}>
            <div className="form__desc">
                <span className="form__title">С возвращением!</span>
                <span className="form__secondary_title">Мы так рады видеть вас снова!</span>
            </div>
            <div className="form__content">
                <div className="form__field">
                    <span className="field__title">Логин</span>
                    <input type="text" name="login" className="field__input" />
                </div>
                <div className="form__field">
                    <span className="field__title">Пароль</span>
                    <input type="password" name="password" className="field__input" />
                </div>
                <Link to={"/login"} className="form__small-text">Забыли пароль?</Link>
            </div>
            <button className="form__confirm">Вход</button>
            <Link to={"/signup"} className="form__small-text" >Нет учетной записи? <b>Зарегистрироваться</b></Link>
        </form>
    </div>
};

export default LoginPage