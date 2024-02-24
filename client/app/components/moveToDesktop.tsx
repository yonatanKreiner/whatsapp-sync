export const MoveToDesktop = () => {

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto'
        }}>
            <div style={{
                maxWidth: '250px', padding: '1rem',
                borderWidth: '3px',
                borderStyle: 'solid',
                borderImage: `linear-gradient(to bottom, var(--main-bg-color), rgba(0, 0, 0, 0)) 1 100%`
            }}>
                Hey 😁, we notice you would like to use our functionality with your mobile device.<br />
                but right now we can make this works only form deskop 💻
            </div>
        </div >
    );
}