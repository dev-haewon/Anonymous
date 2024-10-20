import 'cash-dom';
import Velocity from 'velocity-animate';

declare module 'cash-dom' {
    interface Cash {
        velocity: (animation: any, options?: any) => Cash;
    }
}
