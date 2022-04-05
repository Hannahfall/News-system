import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import Login from '../views/login/Login';
import SandBox from '../views/sandbox/SandBox';
import News from '../views/news/News';
import Detail from '../views/news/Detail';

export default function IndexRouter() {
  return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/news' component={News}/>
                <Route path='/detail/:id' component={Detail}/>
                <Route path='/' render={()=>localStorage.getItem('token')?
                    <SandBox></SandBox>:
                    <Redirect to='/login'/>
                }/>   
                {/* <Route path='/' component={SandBox}/> */}
            </Switch>
        </HashRouter>
  )
}
