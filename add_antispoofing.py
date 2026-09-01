
with open("pi_scripts/recognize_attendance.py", "r", encoding="utf-8") as f:
    c = f.read()

old_block = """            for x, y, w, h in faces:
                face_roi = gray[y : y + h, x : x + w]
                label_id, confidence = recognizer.predict(face_roi)

                if confidence < 70:"""

new_block = """            for x, y, w, h in faces:
                face_roi = gray[y : y + h, x : x + w]
                label_id, confidence = recognizer.predict(face_roi)
                
                # [ANTI-SPOOFING] Calculate Laplacian variance (sharpness/texture)
                blur_val = cv2.Laplacian(face_roi, cv2.CV_64F).var()
                is_spoof = blur_val < 60.0  # Threshold for 2D printed photo or screen blur
                
                acc_pct = max(0.0, 100.0 - confidence)

                if is_spoof:
                    student_name = f"SPOOF WARNING ({blur_val:.0f})"
                    box_color = (0, 0, 255)
                elif confidence < 70:"""
c = c.replace(old_block, new_block)

old_draw = """                cv2.rectangle(frame, (x, y), (x + w, y + h), box_color, 2)
                cv2.putText(frame, student_name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, box_color, 2)"""
new_draw = """                cv2.rectangle(frame, (x, y), (x + w, y + h), box_color, 2)
                cv2.putText(frame, student_name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, box_color, 2)
                if not is_spoof:
                    cv2.putText(frame, f"Match: {acc_pct:.1f}%", (x, y + h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, box_color, 2)
                    cv2.putText(frame, f"Liveness: PASS", (x, y + h + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
                else:
                    cv2.putText(frame, f"Liveness: FAIL", (x, y + h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)"""
c = c.replace(old_draw, new_draw)

with open("pi_scripts/recognize_attendance.py", "w", encoding="utf-8") as f:
    f.write(c)

