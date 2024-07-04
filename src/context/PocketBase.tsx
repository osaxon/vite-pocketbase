import { jwtDecode } from "jwt-decode";
import ms from "ms";
import PocketBase, { AuthModel } from "pocketbase";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useInterval } from "usehooks-ts";

const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("1 minutes");

const PocketContext = createContext({});

export const PocketProvider = ({ children }: { children: React.ReactNode }) => {
    const pb = useMemo(
        () => new PocketBase(import.meta.env.VITE_POCKET_BASE_URL),
        []
    );

    const [token, setToken] = useState(pb.authStore.token);
    const [user, setUser] = useState<AuthModel>(pb.authStore.model);

    useEffect(() => {
        console.log("use effect");
        console.log(token);
        return pb.authStore.onChange((token, model) => {
            setToken(token);
            setUser(model);
        });
    }, [pb.authStore]);

    const refreshSession = useCallback(async () => {
        if (!pb.authStore.isValid) return;
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const expirationWithBuffer = (decoded.exp! + fiveMinutesInMs) / 1000;
        if (tokenExpiration! < expirationWithBuffer) {
            console.log("refreshing token....");
            await pb.collection("users").authRefresh();
            console.log(token);
        }
    }, [pb, token]);

    useInterval(refreshSession, token ? twoMinutesInMs : null);

    return (
        <PocketContext.Provider value={{ user, token, pb }}>
            {children}
        </PocketContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePocket = () => useContext(PocketContext);
