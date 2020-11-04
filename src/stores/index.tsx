import initLoginStore from "./login";
import initPersonManageStore from "./person-manage";

export function initStore() {
  const initLoginStores = initLoginStore();
  const initPersonManageStores = initPersonManageStore();
  return {
    ...initLoginStores,
    ...initPersonManageStores,
  }
}

export const stores = initStore();


