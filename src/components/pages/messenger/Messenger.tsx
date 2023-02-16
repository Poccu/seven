import { FC, useEffect, useState } from 'react'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { BorderBox } from '../../ui/ThemeBox'
import {
  FavoriteBorder,
  Favorite,
  Visibility,
  Clear,
} from '@mui/icons-material'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../providers/useAuth'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  runTransaction,
  Firestore,
  getDocs,
  updateDoc,
  limit,
  deleteDoc,
} from 'firebase/firestore'
import moment from 'moment'
import { AddMessage } from './AddMessage'
import { IMessage, IUser } from '../../../types'
import { ThemeAvatar } from '../../ui/ThemeAvatar'

export const Messenger: FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([])

  const { cur, db, users } = useAuth()

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc')
      // limit(2)
    )

    const unsub = onSnapshot(q, (querySnapshot) => {
      const messagesArr: any[] = []
      querySnapshot.forEach(async (d) => {
        messagesArr.push(d.data())
      })
      setMessages(messagesArr)
      console.log('messagesArr', messagesArr)
    })

    return () => {
      unsub()
    }
  }, [])

  return (
    <>
      {messages.map((message, index) => (
        <Box sx={{ mb: 2 }} key={index}>
          <BorderBox>
            <Box sx={{ p: 3 }}>
              <Stack
                direction={
                  message.author.uid !== cur?.uid ? 'row' : 'row-reverse'
                }
                justifyContent="space-between"
                // alignItems="center"
                // spacing={2}
              >
                <NavLink
                  to={`/profile/${message.author.uid}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Stack
                    alignItems="center"
                    direction={
                      message.author.uid !== cur?.uid ? 'row' : 'row-reverse'
                    }
                    spacing={2}
                    sx={{ mb: 2 }}
                  >
                    {/* <Link to={`/profile/${message.author.uid}`}> */}
                    <ThemeAvatar
                      alt={message.author.displayName}
                      src={
                        users.find((u) => u.uid === message.author.uid)
                          ?.photoURL
                      }
                      sx={{ width: 46, height: 46 }}
                      draggable={false}
                    >
                      <b>
                        {message?.author?.displayName
                          ?.replace(/\B\w+/g, '')
                          .split(' ')
                          .join('')}
                      </b>
                    </ThemeAvatar>
                    {/* </Link> */}
                    <Stack>
                      {/* <Link to={`/profile/${message.author.uid}`}> */}
                      <Typography variant="h6">
                        {message.author.displayName}
                      </Typography>
                      {/* </Link> */}
                      <Typography variant="body2" color="textSecondary">
                        {moment(message.createdAt).fromNow()}
                      </Typography>
                    </Stack>
                  </Stack>
                </NavLink>
                {message.author.uid === cur?.uid && (
                  <IconButton
                    onClick={async () => {
                      await deleteDoc(doc(db, 'messages', message.id))
                    }}
                    color="inherit"
                    sx={{ width: '40px ', height: '40px' }}
                  >
                    <Clear color="inherit" />
                  </IconButton>
                )}
              </Stack>
              {message.author.uid === cur?.uid ? (
                <Typography variant="body1" sx={{ textAlign: 'end' }}>
                  {message.content}
                </Typography>
              ) : (
                <Typography variant="body1">{message.content}</Typography>
              )}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={0.2}
                  sx={{ mt: 2 }}
                >
                  {cur?.uid && !message.likes.includes(cur?.uid) ? (
                    <IconButton
                      onClick={async () => {
                        const docRef = doc(db, 'messages', message.id)

                        try {
                          await runTransaction(db, async (transaction) => {
                            const sfDoc = await transaction.get(docRef)
                            if (!sfDoc.exists()) {
                              throw 'Document does not exist!'
                            }
                            if (!sfDoc.data().likes.includes(cur?.uid)) {
                              const newLikesArr = [
                                ...sfDoc.data().likes,
                                cur?.uid,
                              ]
                              // console.log(newLikesArr)
                              transaction.update(docRef, { likes: newLikesArr })
                            }
                          })
                          console.log('Transaction successfully committed!')
                        } catch (e) {
                          console.log('Transaction failed: ', e)
                        }
                      }}
                      color="inherit"
                    >
                      <FavoriteBorder />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={async () => {
                        const docRef = doc(db, 'messages', message.id)

                        try {
                          await runTransaction(db, async (transaction) => {
                            const sfDoc = await transaction.get(docRef)
                            if (!sfDoc.exists()) {
                              throw 'Document does not exist!'
                            }
                            const newLikesArr = sfDoc
                              .data()
                              .likes.filter((id: IUser) => id !== cur?.uid)
                            // console.log(newLikesArr)
                            transaction.update(docRef, { likes: newLikesArr })
                          })
                          console.log('Transaction successfully committed!')
                        } catch (e) {
                          console.log('Transaction failed: ', e)
                        }
                      }}
                      color="error"
                    >
                      <Favorite />
                    </IconButton>
                  )}

                  <Typography variant="body1" color="textSecondary">
                    <b>{message.likes.length > 0 && message.likes.length}</b>
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </BorderBox>
        </Box>
      ))}
      <AddMessage />
    </>
  )
}
