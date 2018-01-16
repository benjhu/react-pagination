import React from "react";
import { NavigatorBase } from "./NavigatorBase";

export default (fn, wrapper, navigatorName) => {
    let Wrap;

    if (wrapper)
        Wrap = wrapper;

    class CustomNavigator extends React.Component {
        render() {
            const insides = (
                <NavigatorBase { ...this.props }>
                    {
                        fn
                    }
                </NavigatorBase>
            );

            if (Wrap)
                return (
                    <Wrap>
                        { insides }
                    </Wrap>
                );

            return insides;
        }
    }

    // Default name for this Navigator.
    // The user can redefine it after calling the createNavigator()
    // function.
    CustomNavigator.navigatorName = navigatorName ? navigatorName : "CustomNavigator";

    return CustomNavigator;
};