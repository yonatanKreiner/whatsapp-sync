import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import LoadingAnimation from '../../public/assets/animation_loading.json';
import SucceedAnimation from '../../public/assets/animation_succeed.json';


export const PricingTiers = () => {

    return (
        <div style={{display: 'flex',justifyContent:'center'}}>
            <div style={{
                display: 'flex'
            }}>
                <div style={{
                    flex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'white',
                    border: 'solid 2px #c1c1c1',
                    borderRadius: '8px',
                    marginTop: '10px',
                    marginLeft: '10px',
                    padding: '12px'
                }}>
                    <div style={{
                        color: 'grey'
                    }}>
                        Tiral
                    </div>
                    <div style={{
                        color: 'grey'
                    }}>
                        <b>free</b><span style={{ fontSize: '0.7rem' }}> / onetime</span>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>up to 10 random contacts photos import</div>
                    <button>START</button>

                </div>

                <div style={{
                    flex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'white',
                    border: 'solid 2px #c1c1c1',
                    borderRadius: '8px',
                    marginTop: '10px',
                    marginLeft: '10px',
                    padding: '12px'
                }}>
                    <div style={{
                        color: 'grey'
                    }}>
                        PRO
                    </div>
                    <div style={{
                        color: 'grey'
                    }}>
                        <b>15$</b><span style={{ fontSize: '0.7rem' }}> / onetime</span>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>up to 150 random contacts photos import</div>
                    <button>START</button>
                </div>

                <div style={{
                    flex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'white',
                    border: 'solid 2px #c1c1c1',
                    borderRadius: '8px',
                    marginTop: '10px',
                    marginLeft: '10px',
                    padding: '12px'
                }}>
                    <div style={{
                        color: 'grey'
                    }}>
                        Expert
                    </div>
                    <div style={{
                        color: 'grey'
                    }}>
                        <b>30$</b><span style={{ fontSize: '0.7rem' }}> / onetime</span>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>All contacts photos import</div>
                    <button>START</button>
                </div>
            </div>
        </div>
    );
}