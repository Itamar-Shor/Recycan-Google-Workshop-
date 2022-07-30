import { StatusBar } from "react-native";
import { showMessage } from "react-native-flash-message";

export const showError = (msg) => {
    showMessage({
        message: msg,
        type: "error",
        icon: 'auto',
        floating: true,
        position: { top: StatusBar.currentHeight + 12 }
    });
}