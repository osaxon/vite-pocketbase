import { Button } from "@/components/ui/button";
import { useSubscribeToLesson } from "@/utils/subscribeToLesson";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: Home,
});

function Home() {
    const queryClient = useQueryClient();
    const { mutate } = useSubscribeToLesson(queryClient);
    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to your new app!</p>
            <Button
                onClick={() => {
                    mutate({
                        userId: "650wngkqc9e8qi3",
                        lessonId: "qif04ud91lew7q1",
                    });
                }}
            >
                Subscribe
            </Button>
        </div>
    );
}
