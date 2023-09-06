import axios from "axios";
import Lottie from "lottie-react";
import { useState } from "react";
import Swal from "sweetalert2";
import LoadingAnimation from '../../public/assets/animation_loading.json';

export const PricingTiers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPickedPlan, setIsPickedPlan] = useState(false);

    const onClickTrial = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/auth/pricing/trial', {
                withCredentials: true
            });

            if (res.status == 200) {
                setIsPickedPlan(true);
            }
        } catch (err) {
            Swal.fire(
                'Something went wrong',
                'Do you login to your google account?',
                'question'
            )
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {isLoading ? <Lottie style={{ width: "15%", height: "15%" }} animationData={LoadingAnimation} />
                : !isPickedPlan ?
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
                            <button onClick={onClickTrial}>START</button>
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
                            <div style={{ fontSize: '0.8rem' }}>up to 250 random contacts photos import</div>
                            <button disabled>comming soon</button>
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
                            <div style={{ fontSize: '0.8rem' }}>All contacts photos import (up to 1000 contacts)</div>
                            <button disabled>comming soon</button>
                        </div>
                    </div>
                    : <>plan picked successfully!</>}
        </div>
    );
}