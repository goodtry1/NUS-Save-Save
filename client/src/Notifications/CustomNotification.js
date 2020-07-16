import React from 'react'

const CustomNotification = {
   
    /**
     * 
     * @param {*} place - place of the notification, it can be 'tl', 'tc', 'tr' for top left, centre and right, 'bl', 'bc', 'br' for bottom left centre and right
     * @param {*} color - color of the notification
     * @param {*} message - message that you want to be displayed
     */
    notify(place, color, message) {
        var type;
        switch (color) {
            case 1:
                type = "primary";
                break;
            case 2:
                type = "success";
                break;
            case 3:
                type = "danger";
                break;
            case 4:
                type = "warning";
                break;
            case 5:
                type = "info";
                break;
            default:
                break;
        }
        var options = {};
        options = {
            place: place,
            message: (
                <div>
                    <div>
                        {message}
                    </div>
                </div>
            ),
            type: type,
            icon: "now-ui-icons ui-1_bell-53",
            autoDismiss: 7
        };

        return options
    }
}
export { CustomNotification as default }
