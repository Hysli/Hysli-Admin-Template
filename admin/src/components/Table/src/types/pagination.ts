export interface PaginationProps {
  page?: number; //�ܿ�ģʽ�µĵ�ǰҳ
  itemCount?: number; //������
  pageCount?: number; //��ҳ��
  pageSize?: number; //�ܿ�ģʽ�µķ�ҳ��С
  pageSizes?: number[]; //ÿҳ������ ���Զ���
  showSizePicker?: boolean; //�Ƿ���ʾÿҳ������ѡ����
  showQuickJumper?: boolean; //�Ƿ���ʾ������ת
  prefix?: any; //��ҳǰ׺
}
