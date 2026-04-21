import type * as Party from 'partykit/server'

/**
 * GameRoom — one Durable Object instance per active game.
 *
 * Phase 3 will implement full game state, move validation via @frontline/rules,
 * server-authoritative clock, and spectator broadcast. For now this is a
 * connection stub that echoes messages back to all connections in the room.
 */
export default class GameRoom implements Party.Server {
  room: Party.Room

  constructor(room: Party.Room) {
    this.room = room
  }

  onConnect(conn: Party.Connection, _ctx: Party.ConnectionContext) {
    conn.send(JSON.stringify({ type: 'connected', roomId: this.room.id }))
  }

  onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    // Broadcast to all connections except the sender
    this.room.broadcast(typeof message === 'string' ? message : message, [sender.id])
  }

  onClose(conn: Party.Connection) {
    this.room.broadcast(JSON.stringify({ type: 'player_left', connId: conn.id }), [conn.id])
  }
}
