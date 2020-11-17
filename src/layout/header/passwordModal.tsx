import React from "react"
import { getCurrentUser } from "../../utils/tool";
import { Modal, Form, Input, message } from 'antd';
import {observer, useStores} from "../../utils/mobx";
import { withRouter } from "react-router"
import {ObjectType} from "../index";

const { Password } = Input

const PasswordModal = (props: ObjectType) => {
    const [form] = Form.useForm()
    const {validateFields} = form
    const { showModal, visible, history } = props

    const user = getCurrentUser()

    const { userStore, loginStore } = useStores()
    const { editUser } = userStore
    const { exit } = loginStore

    const layout = {
        labelCol: {span: 6},
        wrapperCol: {span: 18},
    };

    const handleSubmit = async () => {
        try {
            const data: any = await validateFields()
            delete data.confirm
            const params = {
                ...data,
                id: user.id
            }
            const res = await editUser(params)
            showModal && showModal()
            if (res.code === 200) {
                await exit()
                history.push("/login")
            }
        } catch (err) {
            const {errorFields} = err
            console.log(errorFields)
        }
    }

    return (
        <Modal
            title={"个人设置"}
            onCancel={showModal}
            visible={visible}
            cancelText={"取消"}
            okText={"确认"}
            onOk={handleSubmit}
        >
            <Form
                {...layout}
                form={form}
                scrollToFirstError={true}
            >
                <Form.Item
                    name="password"
                    label="旧密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入旧密码!',
                        },
                    ]}
                    hasFeedback
                >
                    <Password />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    label="新密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入新密码!',
                        },
                    ]}
                    hasFeedback
                >
                    <Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="确认新密码"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请确认新密码!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule: any, value: any) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('两次密码输入不一致!');
                            },
                        }),
                    ]}
                >
                    <Password />
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default observer(withRouter(PasswordModal))
