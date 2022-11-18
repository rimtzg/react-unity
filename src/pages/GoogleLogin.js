import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = "265534216085-g1bqcash8earsbhc0sl75vpl8q36dktl.apps.googleusercontent.com"

function GoogleLoginPage() {
    const responseGoogle = (response) => {
        console.log(response)
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} >
            <GoogleLogin
                onSuccess={responseGoogle}
                onError={responseGoogle}
            />
        </GoogleOAuthProvider>
    )
}

export default GoogleLoginPage;