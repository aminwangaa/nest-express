import powerStore from './power/powerStore';
import roleStore from './role/roleStore';
import userStore from './user/userStore';

export default function initPersonManageStore() {
    return {
        powerStore,
        roleStore,
        userStore
    };
}
