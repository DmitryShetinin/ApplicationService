import { useState } from "react";
import useNotificationStore 
    from "../../../store/notificationStore";

import "./NotificationBell.css";


export default function NotificationBell(){

    const [open,setOpen] = useState(false);


    const notifications =
        useNotificationStore(
            x => x.notifications
        );


    return (

        <div className="notification-wrapper">


            <button
                className="notification-button"
                onClick={() => setOpen(!open)}
            >

                🔔


                {
                    notifications.length > 0 &&
                    (
                        <span className="notification-count">
                            {notifications.length}
                        </span>
                    )
                }


            </button>



            {
                open &&
                (

                    <div className="notification-dropdown">


                        {
                            notifications.length === 0
                            ?

                            (
                                <div>
                                    Нет уведомлений
                                </div>
                            )

                            :

                            notifications.map(x=>(

                                <div 
                                    key={x.id}
                                    className="notification-item"
                                >

                                    <b>
                                        {x.title}
                                    </b>


                                    <div>
                                        {x.message}
                                    </div>


                                </div>

                            ))

                        }


                    </div>

                )
            }


        </div>

    );

}