import re

# Old purple brand scale and purple-tinted greys -> light-blue scale and cool neutral greys.
MAP = {
    # brand
    'F6F3FF': 'F3F9FD', 'EEE8FF': 'E6F3FB', 'DDD0FF': 'CCE7F6', 'C7B3FF': 'A9D8F2', 'A98CF6': '7FC0E8',
    '6E4FD3': '3B8FC4', '5A3DB8': '2C76A8', '3F2888': '1F5B85', '2A1454': '0E2A3E', '1C0C3D': '0A2131',
    '7A5BBF': '4A90C2', '1D1430': '0F1E2A', '2D2148': '16324A', '211836': '0F2433',
    # greys
    '15121E': '111A22', 'F4F3F8': 'F6F8FA', 'F4F2F8': 'F3F6F9', 'E2DFEA': 'E1E7ED', 'E1DFE8': 'E4E9EE',
    'CBC7D6': 'C9D2DB', 'C5C2CF': 'C8D1DA', 'ABA6BA': 'A6B1BC', 'A7A3B2': 'A5AFB9', '8C879C': '8893A0',
    '8A8696': '87929E', '6F6A80': '6C7886', '6D697A': '6A7582', '534E63': '505C69', '514D5E': '4E5965',
    '3B3649': '38434F', '383445': '36404B', '24212F': '222A33', '2A2636': '26303A', '19151F': '151C23',
    '100D17': '0D1318',
}
PAT = re.compile(r'#(' + '|'.join(MAP) + r')(?![0-9a-fA-F]{1}(?:[0-9a-fA-F]{1})?\b)', re.I)


def recolor(s):
    return re.sub(r'#([0-9a-fA-F]{6})(?=[0-9a-fA-F]{0,2}\b)',
                  lambda m: '#' + MAP.get(m.group(1).upper(), m.group(1)), s)
