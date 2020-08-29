import { Inject } from '@nestjs/common';

import { ETCD_CONNECTION } from './etcd.constants';

export const EtcdClient = () => Inject(ETCD_CONNECTION);
