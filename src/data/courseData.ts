import { Topic } from '../types';

export const courseData: Topic[] = [
  {
    id: 't1',
    title: 'Chủ đề 1. Máy tính và em',
    lessons: [
      { id: 'l1', topicId: 't1', title: 'Máy tính và em - Mô phỏng tổng hợp', description: 'Trải nghiệm học tập tích hợp Trí tuệ Nhân tạo (Gemini AI) về Phần cứng, Phần mềm và Kỹ năng Gõ phím.', simulatorType: 'topic1_integrated' }
    ]
  },
  {
    id: 't2',
    title: 'Chủ đề 2. Mạng máy tính và Internet',
    lessons: [
      { id: 'l3', topicId: 't2', title: 'Bài 3. Thông tin trên trang web', description: 'Mô phỏng giao diện trình duyệt web, cho phép gõ URL và bấm vào các siêu liên kết.', simulatorType: 'browser_sim', simulatorData: { mode: 'browse' } }
    ]
  },
  {
    id: 't3',
    title: 'Chủ đề 3. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin',
    lessons: [
      { id: 'l4', topicId: 't3', title: 'Bài 4. Tìm kiếm thông tin trên Internet', description: 'Mô phỏng cỗ máy tìm kiếm, nhập từ khóa tìm kiếm và xem kết quả.', simulatorType: 'browser_sim', simulatorData: { mode: 'search' } },
      { id: 'l5', topicId: 't3', title: 'Bài 5. Thao tác với tệp và thư mục', description: 'Sandbox File Explorer: Tạo thư mục, đổi tên, sắp xếp tệp tin giống Windows.', simulatorType: 'file_explorer' }
    ]
  },
  {
    id: 't4',
    title: 'Chủ đề 4. Đạo đức, pháp luật và văn hoá trong môi trường số',
    lessons: [
      { id: 'l6', topicId: 't4', title: 'Bài 6. Sử dụng phần mềm khi được phép', description: 'Mô phỏng tiến trình cài đặt phần mềm hỏi khóa bản quyền (License Key) và hệ quả khi lấy phần mềm lậu.', simulatorType: 'software_install' }
    ]
  },
  {
    id: 't5',
    title: 'Chủ đề 5. Ứng dụng tin học',
    lessons: [
      { id: 'l7', topicId: 't5', title: 'Bài 7. Tạo bài trình chiếu', description: 'Mô phỏng phần mềm báo cáo (PowerPoint): Tạo Slide mới, nhập tiêu đề.', simulatorType: 'office_sim', simulatorData: { app: 'powerpoint', mode: 'new' } },
      { id: 'l8', topicId: 't5', title: 'Bài 8. Định dạng văn bản trên trang chiếu', description: 'Mô phỏng bôi đen văn bản và nhấn In đậm (B), In nghiêng (I), Đổi màu chữ.', simulatorType: 'office_sim', simulatorData: { app: 'powerpoint', mode: 'format' } },
      { id: 'l9', topicId: 't5', title: 'Bài 9. Hiệu ứng chuyển trang', description: 'Mô phỏng Tab Transitions, áp dụng slide transition và trình chiếu.', simulatorType: 'office_sim', simulatorData: { app: 'powerpoint', mode: 'transition' } },
      { id: 'l10', topicId: 't5', title: 'Bài 10. Phần mềm soạn thảo văn bản', description: 'Mô phỏng giao diện Word, chức năng gõ và lưu tài liệu.', simulatorType: 'office_sim', simulatorData: { app: 'word', mode: 'typing' } },
      { id: 'l11', topicId: 't5', title: 'Bài 11. Chỉnh sửa văn bản', description: 'Mô phỏng các thao tác Undo, Redo, Copy, Paste trong đoạn văn.', simulatorType: 'office_sim', simulatorData: { app: 'word', mode: 'editing' } },
      { id: 'l12a', topicId: 't5', title: 'Bài 12A. Thực hành đa phương tiện', description: 'Mô phỏng mở tệp video/âm thanh bằng Media Player.', simulatorType: 'media_player' },
      { id: 'l12b', topicId: 't5', title: 'Bài 12B. Phần mềm luyện tập gõ bàn phím', description: 'Trò chơi hứng chữ (Typing Game) rèn tốc độ gõ phím ảo.', simulatorType: 'keyboard_hands', simulatorData: { mode: 'game' } }
    ]
  },
  {
    id: 't6',
    title: 'Chủ đề 6. Giải quyết vấn đề với sự trợ giúp của máy tính',
    lessons: [
      { id: 'l13', topicId: 't6', title: 'Bài 13. Chơi với máy tính', description: 'Sandbox trải nghiệm một ứng dụng đã được lập trình sẵn.', simulatorType: 'scratch_sim', simulatorData: { mode: 'play' } },
      { id: 'l14', topicId: 't6', title: 'Bài 14. Khám phá môi trường lập trình trực quan', description: 'Mô phỏng giao diện Scratch, kéo các khối lệnh Di chuyển ra khu vực kịch bản.', simulatorType: 'scratch_sim', simulatorData: { mode: 'explore' } },
      { id: 'l15', topicId: 't6', title: 'Bài 15. Tạo chương trình máy tính để diễn tả ý tưởng', description: 'Mô phỏng ghép lệnh nối tiếp theo thuật toán tuần tự.', simulatorType: 'scratch_sim', simulatorData: { mode: 'sequential' } },
      { id: 'l16', topicId: 't6', title: 'Bài 16. Chương trình của em', description: 'Sandbox tự do với Vòng lặp, Điều kiện và Nhân vật tuỳ chọn.', simulatorType: 'scratch_sim', simulatorData: { mode: 'creative' } },
    ]
  }
];
