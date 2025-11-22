

// import { useUser } from "@clerk/clerk-react";
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router";
// import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
// import { PROBLEMS } from "../data/problems";
// import { executeCode } from "../lib/piston";
// import Navbar from "../components/Navbar";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
// import { getDifficultyBadgeClass } from "../lib/utils";
// import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
// import CodeEditorPanel from "../components/CodeEditorPanel";
// import OutputPanel from "../components/OutputPanel";

// import useStreamClient from "../hooks/useStreamClient";
// import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
// import VideoCallUI from "../components/VideoCallUI";
// import { captureElementScreenshot } from "../lib/screenshot";

// /**
//  * Safe, robust SessionPage
//  */
// function SessionPage() {
//   const navigate = useNavigate();
//   const { id } = useParams(); // session id from route
//   const { user } = useUser();

//   const [output, setOutput] = useState(null);
//   const [isRunning, setIsRunning] = useState(false);

//   // fetch session by id



//   const {
//     data: sessionData,
//     isLoading: loadingSession,
//     refetch,
//     isError: sessionError,
//   } = useSessionById(id);

//   const joinSessionMutation = useJoinSession();
//   const endSessionMutation = useEndSession();

//   const session = sessionData?.session ?? null;


//   //screenshot logic goes here
//   const [preview, setPreview] = useState(null);

// async function takeScreenshot() {
//   const img = await captureElementScreenshot("capture-area");
//   if (!img) return;

//   setPreview(img);

//   // Hide preview after 3 seconds
//   setTimeout(() => setPreview(null), 3000);
// }


//   // safe checks for host/participant
//   const isHost = !!(session?.host && user?.id && session.host.clerkId === user.id);
//   const isParticipant = !!(
//     session?.participant &&
//     user?.id &&
//     session.participant.clerkId === user.id
//   );

//   // stream client hook: provide session only when available
//   const {
//     call,
//     channel,
//     chatClient,
//     isInitializingCall,
//     streamClient,
//   } = useStreamClient(session ?? undefined, loadingSession, isHost, isParticipant);

//   // find the problem object in PROBLEMS (memoized)
//   const problemData = useMemo(() => {
//     if (!session?.problem) return null;
//     return Object.values(PROBLEMS).find((p) => p.title === session.problem) ?? null;
//   }, [session?.problem]);

//   // language selection + code state
//   const [selectedLanguage, setSelectedLanguage] = useState("javascript");
//   // initialize code from problem starter if available; otherwise empty string
//   const [code, setCode] = useState(() => {
//     return problemData?.starterCode?.["javascript"] ?? "";
//   });

//   /**
//    * Auto-join:
//    * If session exists and user is neither host nor participant and we're not loading,
//    * trigger joinSession. We keep the dependencies minimal to avoid loops.
//    */
//   useEffect(() => {
//     if (!session || !user || loadingSession) return;
//     if (isHost || isParticipant) return;

//     // defensive: only call if mutation is available
//     try {
//       joinSessionMutation.mutate(
//         id,
//         { onSuccess: () => refetch?.() }
//       );
//     } catch (err) {
//       // swallow - join failure is not fatal for rendering
//       // optionally you can set local state to display an error card
//       // console.error("Auto-join failed:", err);
//     }
//     // intentionally not including joinSessionMutation/refetch functions in dependency array
//     // to avoid re-triggering; the important triggers are session, user, loadingSession, isHost, isParticipant, id
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [session, user, loadingSession, isHost, isParticipant, id]);

//   // redirect participants when session completes
//   useEffect(() => {
//     if (!session || loadingSession) return;
//     if (session.status === "completed") navigate("/dashboard");
//   }, [session, loadingSession, navigate]);

//   // when problemData or selectedLanguage changes, update the editor code (use effect)
//   useEffect(() => {
//     const starter = problemData?.starterCode?.[selectedLanguage] ?? "";
//     // only update code if the current code is empty or if we just loaded a new problem
//     setCode(starter);
//     // reset output when language or problem changes
//     setOutput(null);
//   }, [problemData, selectedLanguage]);

//   // safe language change handler
//   const handleLanguageChange = (e) => {
//     const newLang = e?.target?.value ?? "javascript";
//     setSelectedLanguage(newLang);
//     const starter = problemData?.starterCode?.[newLang] ?? "";
//     setCode(starter);
//     setOutput(null);
//   };

//   // run code with safe error handling
//   const handleRunCode = async () => {
//     setIsRunning(true);
//     setOutput(null);
//     try {
//       const result = await executeCode(selectedLanguage, code);
//       setOutput(result ?? null);
//     } catch (err) {
//       setOutput({ error: true, message: (err && err.message) || "Execution failed" });
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const handleEndSession = () => {
//     // defensive confirm + mutation usage
//     const confirmed = window.confirm(
//       "Are you sure you want to end this session? All participants will be notified."
//     );
//     if (!confirmed) return;

//     try {
//       endSessionMutation.mutate(id, {
//         onSuccess: () => navigate("/dashboard"),
//       });
//     } catch (err) {
//       // console.error("Failed to end session:", err);
//     }
//   };

//   // small helpers for safe rendering
//   const participantCount = (() => {
//     if (!session) return 0;
//     return session.participant ? 2 : 1;
//   })();

//   const difficultyLabel = (() => {
//     const raw = session?.difficulty ?? "";
//     if (!raw || typeof raw !== "string") return "Easy";
//     return raw.charAt(0).toUpperCase() + raw.slice(1);
//   })();

//   // render safe lists (examples/constraints)
//   const safeExamples = Array.isArray(problemData?.examples) ? problemData.examples : [];
//   const safeConstraints = Array.isArray(problemData?.constraints) ? problemData.constraints : [];

//   // if session failed to load show a friendly message
//   if (sessionError) {
//     return (
//       <div className="h-screen bg-base-100 flex flex-col">
//         <Navbar />
//         <div className="flex-1 flex items-center justify-center">
//           <div className="card bg-base-100 shadow-lg p-6">
//             <h2 className="text-xl font-bold">Unable to load session</h2>
//             <p className="mt-2 text-sm text-base-content/70">
//               There was a problem fetching the session. Try refreshing or go back to dashboard.
//             </p>
//             <div className="mt-4 flex gap-2">
//               <button className="btn" onClick={() => refetch?.()}>
//                 Retry
//               </button>
//               <button className="btn btn-ghost" onClick={() => navigate("/dashboard")}>
//                 Dashboard
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // initial loading state
//   if (loadingSession && !session) {
//     return (
//       <div className="h-screen bg-base-100 flex flex-col">
//         <Navbar />
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
//             <p className="text-lg">Loading session...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen bg-base-100 flex flex-col">
//       <Navbar />

//       <div className="flex-1">
//         <PanelGroup direction="horizontal">
//           {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
//           <Panel defaultSize={50} minSize={30}>
//             <PanelGroup direction="vertical">
//               {/* PROBLEM DSC PANEL */}
//               <Panel defaultSize={50} minSize={20}>
//                 <div className="h-full overflow-y-auto bg-base-200">
//                   {/* HEADER SECTION */}
//                   <div className="p-6 bg-base-100 border-b border-base-300">
//                     <div className="flex items-start justify-between mb-3">
//                       <div>
//                         <h1 className="text-3xl font-bold text-base-content">
//                           {session?.problem ?? "Loading..."}
//                         </h1>
//                         {problemData?.category && (
//                           <p className="text-base-content/60 mt-1">{problemData.category}</p>
//                         )}
//                         <p className="text-base-content/60 mt-2">
//                           Host: {session?.host?.name ?? "Loading..."} • {participantCount}/2
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <span className={`badge badge-lg ${getDifficultyBadgeClass(session?.difficulty)}`}>
//                           {difficultyLabel}
//                         </span>

//                         {isHost && session?.status === "active" && (
//                           <button
//                             onClick={handleEndSession}
//                             disabled={endSessionMutation.isPending}
//                             className="btn btn-error btn-sm gap-2"
//                           >
//                             {endSessionMutation.isPending ? (
//                               <Loader2Icon className="w-4 h-4 animate-spin" />
//                             ) : (
//                               <LogOutIcon className="w-4 h-4" />
//                             )}
//                             End Session
//                           </button>
//                         )}

//                         {session?.status === "completed" && (
//                           <span className="badge badge-ghost badge-lg">Completed</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-6 space-y-6">
//                     {/* problem desc */}
//                     {problemData?.description?.text && (
//                       <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
//                         <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
//                         <div className="space-y-3 text-base leading-relaxed">
//                           <p className="text-base-content/90">{problemData.description.text}</p>
//                           {Array.isArray(problemData.description.notes) &&
//                             problemData.description.notes.map((note, idx) => (
//                               <p key={idx} className="text-base-content/90">
//                                 {note}
//                               </p>
//                             ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* examples section */}
//                     {safeExamples.length > 0 && (
//                       <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
//                         <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

//                         <div className="space-y-4">
//                           {safeExamples.map((example, idx) => (
//                             <div key={idx}>
//                               <div className="flex items-center gap-2 mb-2">
//                                 <span className="badge badge-sm">{idx + 1}</span>
//                                 <p className="font-semibold text-base-content">Example {idx + 1}</p>
//                               </div>
//                               <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
//                                 <div className="flex gap-2">
//                                   <span className="text-primary font-bold min-w-[70px]">
//                                     Input:
//                                   </span>
//                                   <span>{String(example.input ?? "")}</span>
//                                 </div>
//                                 <div className="flex gap-2">
//                                   <span className="text-secondary font-bold min-w-[70px]">
//                                     Output:
//                                   </span>
//                                   <span>{String(example.output ?? "")}</span>
//                                 </div>
//                                 {example.explanation && (
//                                   <div className="pt-2 border-t border-base-300 mt-2">
//                                     <span className="text-base-content/60 font-sans text-xs">
//                                       <span className="font-semibold">Explanation:</span>{" "}
//                                       {example.explanation}
//                                     </span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Constraints */}
//                     {safeConstraints.length > 0 && (
//                       <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
//                         <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
//                         <ul className="space-y-2 text-base-content/90">
//                           {safeConstraints.map((constraint, idx) => (
//                             <li key={idx} className="flex gap-2">
//                               <span className="text-primary">•</span>
//                               <code className="text-sm">{constraint}</code>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </Panel>

//               <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

//               <Panel defaultSize={50} minSize={20}>
//                 <PanelGroup direction="vertical">
//                   <Panel defaultSize={70} minSize={30}>
//                     <CodeEditorPanel
//                       selectedLanguage={selectedLanguage}
//                       code={code}
//                       isRunning={isRunning}
//                       onLanguageChange={handleLanguageChange}
//                       onCodeChange={(value) => setCode(value)}
//                       onRunCode={handleRunCode}
//                     />
//                   </Panel>

//                   <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

//                   <Panel defaultSize={30} minSize={15}>
//                     <OutputPanel output={output} />
//                   </Panel>
//                 </PanelGroup>
//               </Panel>
//             </PanelGroup>
//           </Panel>

//           <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

//           {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
//           <Panel defaultSize={50} minSize={30}>
//             <div className="h-full bg-base-200 p-4 overflow-auto">
//               {isInitializingCall ? (
//                 <div className="h-full flex items-center justify-center">
//                   <div className="text-center">
//                     <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
//                     <p className="text-lg">Connecting to video call...</p>
//                   </div>
//                 </div>
//               ) : !streamClient || !call ? (
//                 <div className="h-full flex items-center justify-center">
//                   <div className="card bg-base-100 shadow-xl max-w-md">
//                     <div className="card-body items-center text-center">
//                       <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
//                         <PhoneOffIcon className="w-12 h-12 text-error" />
//                       </div>
//                       <h2 className="card-title text-2xl">Connection Failed</h2>
//                       <p className="text-base-content/70">Unable to connect to the video call</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="h-full">
//                   {/* only render StreamVideo/StreamCall when we actually have the clients */}
//                   <StreamVideo client={streamClient}>
//                     <StreamCall call={call}>
//                       <VideoCallUI chatClient={chatClient} channel={channel} />
//                     </StreamCall>
//                   </StreamVideo>
//                 </div>
//               )}
//             </div>
//           </Panel>
//         </PanelGroup>
//       </div>
//     </div>
//   );
// }

// export default SessionPage;




import { useUser } from "@clerk/clerk-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import {
  Loader2Icon,
  LogOutIcon,
  PhoneOffIcon,
  CameraIcon,
  XIcon,
} from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

// 🔥 your region capture util
import { captureRegion } from "../lib/captureWindowRegion";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch,
    isError: sessionError,
  } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session ?? null;

  // ------------------ SCREENSHOT SYSTEM ------------------
  const [preview, setPreview] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState(null); // "left" | "right" | "full"
  const [stream, setStream] = useState(null);
  const intervalRef = useRef(null);

  async function requestStream() {
    if (stream) return stream;
    try {
      const newStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false,
      });
      setStream(newStream);
      return newStream;
    } catch (e) {
      console.error("Permission denied for screen capture");
      return null;
    }
  }

  function showPreview(dataUrl) {
    setPreview(dataUrl);
    setTimeout(() => {
      setPreview((curr) => (curr === dataUrl ? null : curr));
    }, 3000);
  }

  async function takeCaptureOnce(target) {
    const s = await requestStream();
    if (!s) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    let region;
    if (target === "left") {
      region = { x: 0, y: 0, width: w / 2, height: h };
    } else if (target === "right") {
      region = { x: w / 2, y: 0, width: w / 2, height: h };
    } else {
      region = { x: 0, y: 0, width: w, height: h };
    }

    const img = await captureRegion(region);
    if (img) showPreview(img);
  }

  function startCapture(target) {
    stopCapture();
    setCaptureMode(target);
    setIsCapturing(true);

    takeCaptureOnce(target);

    intervalRef.current = setInterval(() => {
      takeCaptureOnce(target);
    }, 10000);
  }

  function stopCapture() {
    setIsCapturing(false);
    setCaptureMode(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);
  // --------------------------------------------------------

  const isHost = !!(session?.host && user?.id && session.host.clerkId === user.id);
  const isParticipant = !!(
    session?.participant &&
    user?.id &&
    session.participant.clerkId === user.id
  );

  const { call, channel, chatClient, isInitializingCall, streamClient } =
    useStreamClient(session ?? undefined, loadingSession, isHost, isParticipant);

  const problemData = useMemo(() => {
    if (!session?.problem) return null;
    return Object.values(PROBLEMS).find((p) => p.title === session.problem) ?? null;
  }, [session?.problem]);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(() => problemData?.starterCode?.["javascript"] ?? "");

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: () => refetch?.() });
  }, [session, user, loadingSession, isHost, isParticipant, id, joinSessionMutation, refetch]);

  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    const starter = problemData?.starterCode?.[selectedLanguage] ?? "";
    setCode(starter);
    setOutput(null);
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e?.target?.value ?? "javascript";
    setSelectedLanguage(newLang);
    const starter = problemData?.starterCode?.[newLang] ?? "";
    setCode(starter);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    try {
      const result = await executeCode(selectedLanguage, code);
      setOutput(result ?? null);
    } catch (err) {
      setOutput({ error: true, message: err.message || "Execution failed" });
    } finally {
      setIsRunning(false);
    }
  };

  const handleEndSession = () => {
    const confirmed = window.confirm(
      "Are you sure you want to end this session? All participants will be notified."
    );
    if (!confirmed) return;

    endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
  };

  const participantCount = session?.participant ? 2 : 1;
  const difficultyLabel =
    session?.difficulty?.charAt(0).toUpperCase() + session?.difficulty?.slice(1) || "Easy";

  const safeExamples = Array.isArray(problemData?.examples) ? problemData.examples : [];
  const safeConstraints = Array.isArray(problemData?.constraints) ? problemData.constraints : [];

  if (sessionError) {
    return (
      <div className="h-screen bg-base-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <h2>Error loading session</h2>
        </div>
      </div>
    );
  }

  if (loadingSession && !session) {
    return (
      <div className="h-screen bg-base-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2Icon className="animate-spin w-10 h-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto bg-base-200">
                  <div className="p-6 bg-base-100 border-b border-base-300">
                    <h1 className="text-3xl font-bold">{session?.problem}</h1>
                    <p className="text-base-content/60 mt-1">
                      Host: {session?.host?.name} • {participantCount}/2
                    </p>

                    <span
                      className={`badge badge-lg ${getDifficultyBadgeClass(session?.difficulty)}`}
                    >
                      {difficultyLabel}
                    </span>

                    {isHost && session?.status === "active" && (
                      <button
                        onClick={handleEndSession}
                        disabled={endSessionMutation.isPending}
                        className="btn btn-error btn-sm gap-2 ml-3"
                      >
                        <LogOutIcon className="w-4 h-4" />
                        End
                      </button>
                    )}
                  </div>

                  <div className="p-6 space-y-6">
                    {problemData?.description?.text && (
                      <p>{problemData.description.text}</p>
                    )}

                    {safeExamples.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold">Examples</h2>
                        {safeExamples.map((ex, i) => (
                          <pre key={i} className="bg-base-300 p-3 rounded">
                            Input: {ex.input}{"\n"}Output: {ex.output}
                          </pre>
                        ))}
                      </div>
                    )}

                    {safeConstraints.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold mb-2">Constraints</h2>
                        <ul className="list-disc ml-5 space-y-1">
                          {safeConstraints.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300" />

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(v) => setCode(v)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300" />

          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2Icon className="animate-spin w-10 h-10 text-primary" />
                </div>
              ) : !streamClient || !call ? (
                <div className="flex h-full items-center justify-center">
                  <PhoneOffIcon className="w-16 h-16 text-error" />
                </div>
              ) : (
                <StreamVideo client={streamClient}>
                  <StreamCall call={call}>
                    <VideoCallUI chatClient={chatClient} channel={channel} />
                  </StreamCall>
                </StreamVideo>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Screenshot preview */}
      {preview && (
        <div
          className="fixed bottom-28 right-6 bg-black/80 p-2 rounded-xl shadow-xl border border-white/10"
          style={{ zIndex: 9999 }}
        >
          <img src={preview} alt="Screenshot" style={{ width: 200, borderRadius: 8 }} />
        </div>
      )}

      {/* Floating capture button — bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="dropdown dropdown-top dropdown-end">
          <label
            tabIndex={0}
            className={`btn btn-circle shadow-xl ${
              isCapturing ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary-focus"
            }`}
          >
            {isCapturing ? <XIcon className="w-5 h-5 text-white" /> : <CameraIcon className="w-5 h-5 text-white" />}
          </label>

          {!isCapturing && (
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-xl shadow-lg w-48 p-2 space-y-2"
            >
              <li>
                <button onClick={() => startCapture("left")}>Left half</button>
              </li>
              <li>
                <button onClick={() => startCapture("right")}>Right half</button>
              </li>
              <li>
                <button onClick={() => startCapture("full")}>Full screen</button>
              </li>
              <li>
                <button onClick={() => takeCaptureOnce(captureMode || "full")}>
                  Capture now (one-time)
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Stop state override */}
      {isCapturing && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            className="btn btn-circle bg-red-600 hover:bg-red-700 shadow-xl"
            onClick={stopCapture}
          >
            <XIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

export default SessionPage;

