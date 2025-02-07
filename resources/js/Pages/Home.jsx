import AttachmentPreviewModal from "@/Components/App/AttachmentPreviewModal";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageInput from "@/Components/App/MessageInput";
import MessageItem from "@/Components/App/MessageItem";
import { useEventBus } from "@/EventBus";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ChatLayout from "@/Layouts/ChatLayout";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect, useRef, useState } from "react";

function Home({ messages = null, selectedConversation = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const messageCtrRef = useRef(null);
    const { on } = useEventBus();
    const loadMoreIntersect = useRef(null);
    const [noMoreMessage, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});

    const messageCreated = (message) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((pre) => [...pre, message]);
        }
        if (
            (selectedConversation &&
                selectedConversation.is_user &&
                selectedConversation.id == message.sender_id) ||
            selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((pre) => [...pre, message]);
        }
    };

    const messageDeleted = ({ message }) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((pre) => pre.filter((m) => m.id !== message.id));
        }
        if (
            (selectedConversation &&
                selectedConversation.is_user &&
                selectedConversation.id == message.sender_id) ||
            selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((pre) => pre.filter((m) => m.id !== message.id));
        }
    };

    const loadMoreMessages = useCallback(() => {
        if (noMoreMessage) {
            return;
        }

        const firstMessage = localMessages[0];
        if (firstMessage) {
            axios
                .get(route("message.loadOlder", firstMessage.id))
                .then(({ data }) => {
                    if (data.data.length === 0) {
                        setNoMoreMessages(true);
                        return;
                    }

                    const scrollHeight = messageCtrRef.current.scrollHeight;
                    const scrollTop = messageCtrRef.current.scrollTop;
                    const clientHeight = messageCtrRef.current.clientHeight;
                    const tmpScrollFromBottom =
                        scrollHeight - scrollTop - clientHeight;
                    setScrollFromBottom(tmpScrollFromBottom);

                    setLocalMessages((pre) => {
                        return [...data.data.reverse(), ...pre];
                    });
                });
        }
    }, [localMessages, noMoreMessage]);

    const onAttachmentClick = (attachments, ind) => {
        setPreviewAttachment({
            attachments,
            ind,
        });
        setShowAttachmentPreview(true);
    };

    useEffect(() => {
        setTimeout(() => {
            if (messageCtrRef.current) {
                messageCtrRef.current.scrollTop =
                    messageCtrRef.current.scrollHeight;
            }
        }, 10);

        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);

        setScrollFromBottom(0);
        setNoMoreMessages(false);

        return () => {
            offCreated();
            offDeleted();
        };
    }, [selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        if (messageCtrRef.current && scrollFromBottom !== null) {
            messageCtrRef.current.scrollTop =
                messageCtrRef.current.scrollHeight -
                messageCtrRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noMoreMessage) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadMoreMessages();
                    }
                });
            },
            {
                rootMargin: "0px 0px 250px 0px",
            }
        );

        setTimeout(() => {
            if (loadMoreIntersect.current) {
                observer.observe(loadMoreIntersect.current);
            }
        }, 100);

        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text:4xl p-16 text-slate-200">
                        Please select conversation to start chatting
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}
            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messageCtrRef}
                        className="flex-1 overflow-y-auto p-5"
                    >
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200">
                                    No messages yet
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className="flex-1 flex flex-col">
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message, index) => (
                                    <MessageItem
                                        key={index}
                                        message={message}
                                        attachmentClick={onAttachmentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}

            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.ind}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
            )}
        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout>
            <ChatLayout children={page}></ChatLayout>
        </AuthenticatedLayout>
    );
};

export default Home;
