import { FC } from "react";
import { useAuth } from "../../hooks/AuthProvider";


const UserInfo: FC = () => {
    const {userName, rol} = useAuth();

    return <div id="user-info">
        <label className="user-name">{rol}: {userName}</label>
    </div>
}

export default UserInfo;