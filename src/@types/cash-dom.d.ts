import 'cash-dom';
import Velocity from 'velocity-animate';

declare module 'cash-dom' {
    interface Cash {
        velocity: (
            animation: Velocity.AnimationProperties,
            options?: Velocity.Options
        ) => Cash;
    }
}
