import { Link } from "react-router-dom"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"

export default function User({ user }) {
    return (
        <Link to="/rooms/chat" state={user} className="user">
            <img className="profile-img" src={user.profileImgUrl ?? DEFAULT_PROFILE_IMG} />
            <div className="data">
                <h3 className="username">{user.name}</h3>
                <p className="last-msg">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
            </div>
        </Link>
    )
}