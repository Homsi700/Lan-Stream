# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## FFmpeg Dependency for Video Transcoding

This application uses FFmpeg for video transcoding to enable adaptive bitrate streaming. FFmpeg is a powerful command-line tool for handling video, audio, and other multimedia files and streams.

**The video upload and streaming functionality will not work unless FFmpeg is installed on the server running the application.**

### Performance Note

Video transcoding is a very CPU-intensive process. The time it takes to process a video depends heavily on the video's length, resolution, and the processing power of the server. A slow or overheating CPU (e.g., due to a malfunctioning fan) can cause the process to take a very long time or fail entirely.

### Installation on Windows

1.  **Download:** Go to the official FFmpeg download page: [https://ffmpeg.org/download.html#build-windows](https://ffmpeg.org/download.html#build-windows)
2.  **Choose a build:** It's recommended to download a build from `gyan.dev` or `BtbN`. Download the "full" build `.zip` file.
3.  **Extract:** Unzip the downloaded file to a location on your computer, for example, `C:\ffmpeg`.
4.  **Add to Path:** You need to add FFmpeg to the Windows System Path to run it from any command prompt.
    *   Search for "Edit the system environment variables" in the Start Menu and open it.
    *   In the "System Properties" window, click the "Environment Variables..." button.
    *   In the "System variables" section, find and select the `Path` variable, then click "Edit...".
    *   Click "New" and add the path to the `bin` folder inside your extracted ffmpeg folder (e.g., `C:\ffmpeg\bin`).
    *   Click OK on all windows to save the changes.
5.  **Verify Installation:** Open a new Command Prompt or PowerShell and type `ffmpeg -version`. If it shows the FFmpeg version information, the installation was successful. You may need to restart your computer or your code editor for the changes to take effect.
