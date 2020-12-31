import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();
    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {
        setPasswordConfirm(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); // 이벤트로 인해서 reload되는것을 막아줌


        if (Password !== passwordConfirm) return alert("비밀번호과 비밀번호 확인이 일치하지 않습니다.")

        let body = {
            email: Email,
            name: Name,
            password: Password
        }
        
        dispatch(registerUser(body))
        .then(response => {
            if (response.payload.success) {
                props.history.push('/login')
            } else {
                alert("Failed to sign up!");
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <label>Password confirm</label>
                <input type="password" value={passwordConfirm} onChange={onConfirmPasswordHandler} />
                <br />
                <button>Login</button>
            </form>
        </div>
    )
}


export default withRouter(RegisterPage)