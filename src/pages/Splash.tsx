import { StopMetricStreamsOutput } from '@aws-sdk/client-cloudwatch';
import React, { useRef, useState, useContext, Suspense } from 'react';
import { UserContext } from '../../context/userContext';
import { useHistory } from 'react-router-dom';
import {
  SplashFooter,
  SplashLeft,
  SplashBody,
  StartedButton,
  H1,
  Text,
} from '../styles';
import { stat } from 'fs';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, Sky, Cloud, useGLTF } from '@react-three/drei'




type Props = {
  setUserRegion: Function;
  setCurrentView: Function;
  setStart: Function;
};



const Splash = ({ setCurrentView, setUserRegion, setStart }: Props) => {
  const { name, storeName, email, storeEmail } = useContext(UserContext);
  let history = useHistory();

  const startHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const cookieCheck = await fetch('/api/user/checkCoookies', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: 'GET',
    });
    const response = await cookieCheck.json();
    if (response.name && response.arn && response.externalId && response.region) {
      setUserRegion(response.region)
      storeName(response.name)
      setCurrentView('dashboard');
      setStart(true);
      history.push('/home');
    } else {
      setCurrentView('login');
      history.push('/login');
    }
  };

  function Model(props:any) {
    const { scene } = useGLTF('/tree.glb');
    return <primitive object={scene} />;
  }

  function Rig() {
    const camera = useThree((state) => state.camera)
    // state.clock.elapsedTime = 
    return useFrame((state) => {
      camera.position.z = Math.sin(state.clock.elapsedTime) * 10
      // camera.position.x = Math.sin(state.clock.elapsedTime) * -10

      // camera.position.z = Math.sin(100) * 10

    })
  }



  return (
    <>
      <SplashBody>
        <H1>Lambda Monitoring Made Easy</H1>
        <StartedButton onClick={startHandler}>Get Started</StartedButton>
        <Text>
          Accumulus is an open source application for AWS Lambda data
          visualization and cost optimization
        </Text>

   

        <Canvas camera={{ position: [40, 12, 0], fov: 45 }} style={{position:'absolute'}}>
          <ambientLight intensity={0.8} />
          <pointLight intensity={2} position={[0, 0, -1000]} />
          <Suspense fallback={null}>
            <Cloud position={[-15, 0, 20]} speed={0.0} opacity={.3} />
            <Cloud position={[-20, 0, 30]} speed={0.0} opacity={.3} />
            <Cloud position={[4, 2, 25]} speed={0.0} opacity={0.3} />
            <Cloud position={[0, 0, 10]} speed={0.0} opacity={.3} />
            <Cloud position={[-4, -2, -15]} speed={0.0} opacity={.5} />
            <Cloud position={[4, 2, -15]} speed={0.0} opacity={0.5} />
            <Cloud position={[-4, 2, -10]} speed={0.0} opacity={.3} />
            <Cloud position={[4, -2, -5]} speed={0.0} opacity={0.5} />
            <Cloud position={[10, 2, 0]} speed={0.0} opacity={0.3} />
            <Cloud position={[0, 0, -25]} speed={0.0} opacity={0.5} />
            <Cloud position={[-4, 13, -30]} speed={0.0} opacity={.5} />
            <Cloud position={[10, -2, -50]} speed={0.0} opacity={0.5} />
            <Cloud position={[0, 0, -75]} speed={0.01} opacity={0.5} />
            <Cloud position={[-4, 13, -90]} speed={0.01} opacity={.5} />
            <Cloud position={[4, -2, -100]} speed={0.01} opacity={0.5} />
            <Cloud position={[4, 2, -80]} speed={0.01} opacity={0.3} />
            <Rig />
          </Suspense>
         <OrbitControls/>
       </Canvas>
      </SplashBody>
      <SplashFooter>
        <footer>
          <SplashLeft>
            <a href="www.github.com">Github</a>
          </SplashLeft>
          <p>Copyright 2022</p>
        </footer>
      </SplashFooter>
    </>
  );
};

export default Splash;
