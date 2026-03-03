# Video Analysis Utilities

Reference guide for ffmpeg/ffprobe commands used to analyze existing video content. These utilities are essential for the video-extend-plan workflow and any modification that requires understanding the current state of a video file.

## Frame Extraction Patterns

### Keyframes at Regular Intervals

Extract one frame every 2 seconds for visual review and style analysis:

```bash
ffmpeg -i input.mp4 -vf "fps=0.5" -q:v 2 frame_%04d.png
```

- `-vf "fps=0.5"`: One frame per 2 seconds (0.5 fps)
- `-q:v 2`: High quality JPEG/PNG output (lower number = higher quality)
- Output: `frame_0001.png`, `frame_0002.png`, etc.

Adjust the interval by changing the fps value:
- Every 1 second: `fps=1`
- Every 5 seconds: `fps=0.2`
- Every 10 seconds: `fps=0.1`

### Frame at Specific Timestamp

Extract a single frame at an exact timestamp:

```bash
ffmpeg -ss 00:00:05 -i input.mp4 -vframes 1 -q:v 2 frame_at_5s.png
```

- `-ss 00:00:05`: Seek to 5 seconds (format: HH:MM:SS or HH:MM:SS.ms)
- `-vframes 1`: Extract exactly one frame
- Place `-ss` before `-i` for fast seeking (input seeking)

### Scene Change Detection

Extract frames at scene boundaries where visual content changes significantly:

```bash
ffmpeg -i input.mp4 -vf "select='gt(scene,0.3)',showinfo" -vsync 0 scene_%04d.png
```

- `select='gt(scene,0.3)'`: Detect scene changes with threshold 0.3 (range 0.0-1.0)
- `showinfo`: Logs frame metadata including timestamps to stderr
- `-vsync 0`: Prevent frame duplication
- Lower threshold (0.1-0.2) catches subtle changes; higher threshold (0.4-0.6) catches only major scene cuts

To also capture the timestamps of detected scene changes:

```bash
ffmpeg -i input.mp4 -vf "select='gt(scene,0.3)',showinfo" -vsync 0 scene_%04d.png 2>&1 | grep "pts_time"
```

### Last Frame Extraction

Extract the final frame of a video (critical for extend_duration continuity):

```bash
ffmpeg -sseof -0.1 -i input.mp4 -vframes 1 last_frame.png
```

- `-sseof -0.1`: Seek to 0.1 seconds before the end of file
- Essential for image-to-video input when extending a video

### First Frame Extraction

Extract the first frame (useful for replace_section boundary continuity):

```bash
ffmpeg -ss 0 -i input.mp4 -vframes 1 first_frame.png
```

### Frame Range Extraction

Extract all frames within a timestamp range (useful for replace_section analysis):

```bash
ffmpeg -ss 00:00:10 -to 00:00:15 -i input.mp4 -vf "fps=1" -q:v 2 range_%04d.png
```

- `-ss 00:00:10 -to 00:00:15`: Extract from 10s to 15s
- Combined with `fps=1` for one frame per second within the range

## Audio Analysis

### Extract Audio Track

Extract the audio track as a WAV file for analysis or processing:

```bash
ffmpeg -i input.mp4 -vn -acodec pcm_s16le audio.wav
```

- `-vn`: Disable video (audio only)
- `-acodec pcm_s16le`: Output as 16-bit PCM WAV (uncompressed)

### Extract Audio as Original Codec

Preserve the original audio codec (faster, no re-encoding):

```bash
ffmpeg -i input.mp4 -vn -acodec copy audio.aac
```

### Measure Audio Levels

Analyze loudness using the EBU R128 loudnorm filter:

```bash
ffmpeg -i input.mp4 -af loudnorm=print_format=json -f null -
```

Output includes:
- `input_i`: Integrated loudness (LUFS)
- `input_tp`: True peak (dBTP)
- `input_lra`: Loudness range (LU)
- `input_thresh`: Loudness threshold (LUFS)

This is critical for add_narration modifications to set appropriate ducking levels.

### Detect Silence

Find silent segments in the audio (useful for narration insertion points):

```bash
ffmpeg -i input.mp4 -af silencedetect=noise=-30dB:d=0.5 -f null -
```

- `noise=-30dB`: Silence threshold
- `d=0.5`: Minimum silence duration in seconds
- Output logs silence_start and silence_end timestamps

## Metadata Extraction

### Full Probe (All Metadata)

Get complete format and stream information as JSON:

```bash
ffprobe -v quiet -print_format json -show_format -show_streams input.mp4
```

Returns detailed information about all streams (video, audio, subtitle) and the container format. Use this for initial video analysis in Step 1 of the video-extend-plan workflow.

### Duration Only

Get video duration in seconds:

```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4
```

Output: `120.500000` (duration in seconds)

### Resolution

Get video width and height:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 input.mp4
```

Output: `1920x1080`

### Codec

Get the video codec name:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 input.mp4
```

Output: `h264` or `vp9` or `av1`

### Frame Rate (FPS)

Get the video frame rate:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 input.mp4
```

Output: `30/1` (30 fps) or `24000/1001` (23.976 fps)

For a decimal value, use:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of default=noprint_wrappers=1:nokey=1 input.mp4
```

### Aspect Ratio

Get the display aspect ratio:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=display_aspect_ratio -of default=noprint_wrappers=1:nokey=1 input.mp4
```

Output: `16:9` or `9:16`

### Audio Stream Info

Get audio codec, sample rate, and channel layout:

```bash
ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels,channel_layout -of json input.mp4
```

### Total Frame Count

Get the total number of frames in the video:

```bash
ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of default=noprint_wrappers=1:nokey=1 input.mp4
```

Note: This requires decoding the entire video and can be slow for long files. For an estimate without full decode:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of default=noprint_wrappers=1:nokey=1 input.mp4
```

## Scene Boundary Detection Patterns

### Basic Scene Detection with Timestamps

Detect scene changes and log their timestamps without extracting frames:

```bash
ffmpeg -i input.mp4 -vf "select='gt(scene,0.3)',metadata=print" -an -f null - 2>&1 | grep "scene_score\|pts_time"
```

### Scene Detection with Frame Extraction and Log

Extract scene-change frames and save a log of timestamps:

```bash
ffmpeg -i input.mp4 \
  -vf "select='gt(scene,0.3)',showinfo" \
  -vsync 0 \
  scene_%04d.png \
  2>&1 | grep "pts_time" | awk -F'pts_time:' '{print $2}' | awk '{print $1}' > scene_timestamps.txt
```

### Multi-threshold Scene Analysis

Run scene detection at multiple thresholds to categorize change intensity:

```bash
# Major scene changes (hard cuts)
ffmpeg -i input.mp4 -vf "select='gt(scene,0.5)',showinfo" -vsync 0 -f null - 2>&1 | grep "pts_time" > major_cuts.txt

# Minor scene changes (dissolves, gradual transitions)
ffmpeg -i input.mp4 -vf "select='gt(scene,0.15)*lt(scene,0.5)',showinfo" -vsync 0 -f null - 2>&1 | grep "pts_time" > minor_transitions.txt
```

### Scene Segmentation for Replace Section

When planning a section replacement, extract boundary information:

```bash
# Extract the last frame before the replacement section (at timestamp T_start)
ffmpeg -ss {T_start} -i input.mp4 -vframes 1 -q:v 2 boundary_before.png

# Extract the first frame after the replacement section (at timestamp T_end)
ffmpeg -ss {T_end} -i input.mp4 -vframes 1 -q:v 2 boundary_after.png

# Extract all frames in the section being replaced for reference
ffmpeg -ss {T_start} -to {T_end} -i input.mp4 -vf "fps=1" -q:v 2 replaced_section_%04d.png
```

## Integration with video-extend-plan Workflow

These utilities map to specific steps in the video-extend-plan workflow:

### Step 1: receive_existing_video

Use the full probe to extract all video metadata:

```bash
ffprobe -v quiet -print_format json -show_format -show_streams input.mp4
```

### Step 2: analyze_existing_content

Extract keyframes for visual analysis and detect scene boundaries:

```bash
# Extract keyframes every 2 seconds
ffmpeg -i input.mp4 -vf "fps=0.5" -q:v 2 keyframe_%04d.png

# Detect scene changes
ffmpeg -i input.mp4 -vf "select='gt(scene,0.3)',showinfo" -vsync 0 scene_%04d.png 2>&1 | grep "pts_time"

# Analyze audio levels
ffmpeg -i input.mp4 -af loudnorm=print_format=json -f null -
```

### Step 4: plan_modification (by type)

**EXTEND_DURATION**: Extract the last frame for continuity:

```bash
ffmpeg -sseof -0.1 -i input.mp4 -vframes 1 last_frame.png
```

**REPLACE_SECTION**: Extract boundary frames and section content:

```bash
ffmpeg -ss {T_start} -i input.mp4 -vframes 1 -q:v 2 boundary_before.png
ffmpeg -ss {T_end} -i input.mp4 -vframes 1 -q:v 2 boundary_after.png
ffmpeg -ss {T_start} -to {T_end} -i input.mp4 -vf "fps=1" -q:v 2 section_%04d.png
```

**ADD_OVERLAY**: Extract frames at overlay insertion points to verify placement:

```bash
ffmpeg -ss {overlay_start} -i input.mp4 -vframes 1 -q:v 2 overlay_check.png
```

**CHANGE_FORMAT**: Extract representative frames to plan crop regions:

```bash
ffmpeg -i input.mp4 -vf "fps=0.2" -q:v 2 reframe_check_%04d.png
```

**ADD_NARRATION**: Detect silence windows and analyze existing audio:

```bash
ffmpeg -i input.mp4 -af silencedetect=noise=-30dB:d=0.5 -f null - 2>&1 | grep silence
ffmpeg -i input.mp4 -af loudnorm=print_format=json -f null -
```

### Step 6: ensure_continuity

Verify output by extracting frames at modification boundaries:

```bash
# Check boundary frame at the join point
ffmpeg -ss {join_timestamp} -i output.mp4 -vframes 1 -q:v 2 continuity_check.png
```
