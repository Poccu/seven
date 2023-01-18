import { Avatar, Box, IconButton, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '../../providers/useAuth'
import BorderBox from '../../ui/BorderBox'
import SendIcon from '@mui/icons-material/Send'
import {
  collection,
  doc,
  runTransaction,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

type Props = {}

const AddMessage = ({}: Props) => {
  const [content, setContent] = useState('')
  // const [views, setViews] = useState([])
  const { cur, db, ga } = useAuth()

  const addMessageHandler = async (e: any) => {
    if (e.key === 'Enter' && content.trim()) {
      let charList =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

      let idDb = ''

      if (charList) {
        let x = 20
        while (x > 0) {
          let index = Math.floor(Math.random() * charList.length) // pick random index from charList
          idDb += charList[index]
          x--
        }
      }

      try {
        await setDoc(doc(db, 'messages', idDb), {
          author: {
            uid: cur.uid,
            displayName: cur.displayName,
            photoURL: cur.photoURL,
          },
          content,
          createdAt: Date.now(),
          comments: [],
          likes: [],
          views: 0,
          id: idDb,
        })
        setContent('')
      } catch (e) {
        console.error('Error adding document: ', e)
      }

      // const docRef = doc(db, 'views', 'viewsId')

      // // try {
      // await runTransaction(db, async (transaction) => {
      //   const sfDoc = await transaction.get(docRef)
      //   if (!sfDoc.exists()) {
      //     throw 'Document does not exist!'
      //   }
      //   // if (!sfDoc.data().likes.includes(cur?.uid)) {
      //   const newViews = [...sfDoc.data().views, 0]
      //   console.log(sfDoc.data().views)
      //   transaction.update(docRef, { views: newViews })
      //   // }
      // })
      // //   console.log('Transaction successfully committed!')
      // // } catch (e) {
      // //   console.log('Transaction failed: ', e)
      // // }

      setContent('')
      e.target.blur()
    }
  }

  // useEffect(() => {
  //   const docRef = doc(db, 'views', 'viewsId')

  //   try {
  //     runTransaction(db, async (transaction) => {
  //       const sfDoc = await transaction.get(docRef)
  //       if (!sfDoc.exists()) {
  //         throw 'Document does not exist!'
  //       }
  //       // console.log(sfDoc.data())

  //       const newViews = sfDoc.data().views + 1
  //       transaction.update(docRef, { views: newViews })
  //     })
  //     // console.log('Transaction successfully committed!')
  //   } catch (e) {
  //     // console.log('Transaction failed: ', e)
  //   }
  // }, [])

  return (
    <Box sx={{ mb: 2 }}>
      <BorderBox>
        <Box sx={{ p: 3 }}>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Avatar
              alt={cur?.displayName}
              src={cur?.photoURL}
              sx={{ width: 46, height: 46 }}
            >
              <b>
                {cur?.displayName?.replace(/\B\w+/g, '').split(' ').join('')}
              </b>
            </Avatar>
            <TextField
              id="outlined-textarea"
              label={<b>Whats's new?</b>}
              // placeholder="Placeholder"
              // multiline
              fullWidth
              color="secondary"
              // focused
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={addMessageHandler}
            />
            <IconButton
              onClick={() => console.log('test')}
              // onClick={async () => {
              //   await deleteDoc(doc(db, 'posts', post.id))
              // }}
              color="inherit"
              // sx={{ width: '40px ', height: '40px' }}
              size="large"
            >
              <SendIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Stack>
        </Box>
      </BorderBox>
    </Box>
  )
}

export default AddMessage
