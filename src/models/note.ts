/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Entity, Index, JoinColumn, Column, PrimaryColumn, ManyToOne } from 'typeorm';

@Entity('note')
export class Note {
	@PrimaryColumn({ type: 'varchar', length: 32 })
	public id: string;

	@Index()
	@Column({
        type: 'varchar',
        length: 32,
		nullable: true,
		comment: 'The ID of renote target.',
	})
	public renoteId: Note['id'] | null;

	@ManyToOne(type => Note, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public renote: Note | null;

	@Column('text', {
		nullable: true,
	})
	public text: string | null;

	constructor(data: Partial<Note>) {
		if (data == null) return;

		for (const [k, v] of Object.entries(data)) {
			(this as any)[k] = v;
		}
	}
}
