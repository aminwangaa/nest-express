import React, {
    createContext,
    useState,
    useEffect,
    useRef,
    useContext,
    useMemo,
} from "react";

interface ContextProps {
    (id: string, children: React.ReactNode): Promise<any>
}

const Context = createContext<any>(null);

type AliveScopeProps = React.PropsWithChildren<{

}>

interface AliveScopeState {
    id? : string;
    children?: React.ReactNode
}

interface AliveScopeRef {
    // [key:string] : React.Ref<HTMLDivElement>;
    [key:string] : HTMLDivElement;
}

export const AliveScope = (props: AliveScopeProps) => {
    const [state, setState] = useState<AliveScopeState>({});
    let ref: AliveScopeRef = useMemo(() => {
        return {};
    }, []);

    useEffect(() => {

    }, [])

    const keep = useMemo(() => {
        return (id: string, children: React.ReactNode) =>
            new Promise((resolve) => {
                setState((pre: AliveScopeState)=>({
                    ...pre,
                    [id]: { id, children },
                }));
                setTimeout(() => {
                    //需要等待setState渲染完拿到实例返回给子组件。
                    resolve(ref[id]);
                });
            });
    }, [ref]);

    return (
        <Context.Provider value={keep}>
            {props.children && props.children}
            <div>
               {Object.values(state).map(({ id, children }) => {
                   return (
                       <div
                           key={id}
                           ref={(node: HTMLDivElement) => {
                               ref[id] = node;
                           }}
                       >
                           {children && children}
                       </div>
                   )
               })}
            </div>
        </Context.Provider>
    );
}

type KeepAliveProps = React.PropsWithChildren<{
    id: string;
    children: React.ReactNode
}>

const KeepAlive = (props: KeepAliveProps) => {
    const keep = useContext(Context);
    const ref: React.Ref<HTMLDivElement> = useRef(null);
    useEffect(() => {
        const init = async ({ id, children }: KeepAliveProps) => {
            const realContent: any = await keep(id, children);
            if (ref.current && realContent) {
                ref.current.appendChild(realContent);
            }
        };
        init(props);
    }, [props, keep]);
    return <div ref={ref} />;
}

export default KeepAlive;
