import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { urls } from '../../../urls'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import {
  InsertChart,
  Assignment,
  Keyboard,
  ImportExport,
  Contacts,
  FindInPage,
  ExpandLess,
  ExpandMore,
  ContactMail,
  QueueRounded,
  RecentActors,
  Description
} from '@material-ui/icons'
import { Collapse, Typography } from '@material-ui/core'
import permissions from '../../../permissions.json'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      width: '320px',
      backgroundColor: '#263238',
      position: 'fixed'
    },
    rootResponsive: {
      minHeight: '100%',
      maxWidth: '60px',
      backgroundColor: '#263238',
      position: 'fixed'
    },
    fixed: {
      minHeight: '100vh',
      width: '320px',
    },
    fixedResponsive: {
      minHeight: '100vh',
      width: '60px',
    },
    hidden: {
      display: 'none'
    },
    textPrimary: {
      color: '#ffff',
      fontSize: '1rem'
    },
    icon: {
      color: '#ffff',
      width: '1rem'
    },
    menuTitle: {
      color: '#ffff',
      fontWeight: 'bolder',
      fontSize: '1.6rem',
      textAlign: 'center'
    },
    secondaryMenuTitle: {
      color: '#29b6f6',
      fontSize: '1.3rem'
    },
    logo: {
      width: '1.8rem'
    },
    nestedList: {
      background: '#455a64'
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }),
)

// - in this part all the component menu are housed
const initState = {
  selected: '',
  menu: {
    itemHeader: {
      title: {
        main: 'Crecer',
        secondary: 'DMC'
      },
      logo: {
        path: '/images/logotipo-crecer-dmc.svg',
        alt: 'logotipo de crecer dmc'
      }
    },
    items: [
      {
        id: '001',
        title: 'Inicio',
        icon: <InsertChart />,
        permission: permissions.home.view,
        url: urls.app.main.home
      },
      {
        id: '002',
        title: 'Administración de terceros',
        icon: <Contacts />,
        permission: permissions.third.view,
        indexedMenu: {
          open: false,
          items: [
            {
              id: '001-01',
              title: 'Creación de terceros',
              icon: <ContactMail />,
              permission: permissions.third.create,
              url: urls.app.main.third.form
            },
            {
              id: '001-02',
              title: 'Listar terceros',
              icon: <RecentActors/>,
              permission: permissions.third.view,
              url: urls.app.main.third.list
            },
            {
              id: '001-03',
              title: 'Migración de terceros',
              icon: <ContactMail />,
              permission: permissions.third.migrate,
              url: urls.app.main.third.thirdMigrationForm
            }
          ]
        }
      },
      {
        id: '003',
        title: 'Recibos de ingreso / egreso',
        icon: <Keyboard />,
        permission: permissions.movement_receipt.view,
        url: urls.app.main.cashReceipt.form
      },
      {
        id: '004',
        title: 'Transacciones internas',
        icon: <ImportExport />,
        permission: permissions.movement_internal.view,
        url: urls.app.main.internalTransaction.form
      },
      {
        id: '005',
        title: 'Productos',
        icon: <QueueRounded/>,
        permission: permissions.item.view,
        url: urls.app.main.item.form
      },
      {
        id: '006',
        title: 'Factura electrónica',
        icon: <Description/>,
        permission: permissions.electronic_bill.view,
        indexedMenu: {
          open: false,
          items: [
            {
              id: '006-01',
              title: 'Crear factura electrónica',
              icon: <Description/>,
              permission: permissions.electronic_bill.view,
              url: urls.app.main.electronicBill.form
            },
            {
              id: '006-02',
              title: 'Listar factura electrónica',
              icon: <Description/>,
              permission: permissions.electronic_bill.view,
              url: urls.app.main.electronicBill.list
            }
          ]
        }
      },
      {
        id: '007',
        title: 'Reporte de recibos',
        icon: <FindInPage />,
        permission: permissions.movement_receipt.view,
        url: urls.app.main.cashReceipt.report
      },
      {
        id: '008',
        title: 'Reporte de transacciones',
        icon: <Assignment />,
        permission: permissions.movement_internal.view,
        url: urls.app.main.internalTransaction.report
      }
    ]
  }
}

export default function MainMenu() {

  const classes = useStyles()
  const history = useHistory()
  const [state, setState] = React.useState(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  const [sizeScreen, setSizeScreen] = useState(900)

  const matches = useMediaQuery(`(min-width:${sizeScreen}px)`)

  const handleListMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: any,
  ) => {
    if (item.indexedMenu) {
      setState({
        ...state,
        selected: item.id,
        menu: {
          ...state.menu,
          items: state.menu.items.map(savedItem => {
            if (savedItem.id === item.id) {
              if (savedItem.indexedMenu) {
                savedItem.indexedMenu.open = !savedItem.indexedMenu.open
              }
            }
            return savedItem
          })
        }
      })
    } else {
      setState({
        ...state,
        selected: item.id
      })
      history.push(item.url)
    }
  }

  return (
    <div className={matches ? classes.fixed : classes.fixedResponsive}>
      <div className={matches ? classes.root : classes.rootResponsive}>
        <List
          component="nav"
          aria-label="main mailbox folders"
        >
          <ListItem>
            <ListItemIcon
              onClick={() => {
                if (sizeScreen === 900) {
                  setSizeScreen(100)
                } else if (sizeScreen === 100) {
                  setSizeScreen(900)
                }
              }}
            >
              <img
                className={classes.logo}
                src={state.menu.itemHeader.logo.path}
                alt={state.menu.itemHeader.logo.alt}
              />
            </ListItemIcon>
            <Typography
              variant='h6'
              className={matches ? classes.menuTitle : classes.hidden}
            >
              {state.menu.itemHeader.title.main} <span className={classes.secondaryMenuTitle}>{state.menu.itemHeader.title.secondary}</span>
            </Typography>
          </ListItem>

          <Divider />
          {
            state.menu.items.map(item => (
              userContext.permissions.some(permission => permission === item.permission) ? 
              (
                <React.Fragment key={item.id}>
                  <ListItem
                    button
                    selected={state.selected === item.id}
                    onClick={(event) => handleListMenu(event, item)}
                  >
                    <ListItemIcon
                      className={classes.icon}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      className={matches ? classes.textPrimary : classes.hidden}
                    />
                    {
                      item.indexedMenu && matches ?
                        item.indexedMenu.open ? <ExpandLess color='primary' /> : <ExpandMore color='secondary' />
                        :
                        ''
                    }
                  </ListItem>
                  {
                    item.indexedMenu ?
                      (
                        <Collapse
                          in={item.indexedMenu.open}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List
                            component="div"
                            disablePadding
                            className={classes.nestedList}
                          >
                            {
                              item.indexedMenu.items.map(indexedItem => (
                                userContext.permissions.some(permission => permission === indexedItem.permission) ?
                                (
                                  <ListItem
                                    key={indexedItem.id}
                                    button
                                    className={classes.nested}
                                    selected={state.selected === indexedItem.id}
                                    onClick={(event) => handleListMenu(event, indexedItem)}
                                  >
                                    <ListItemIcon
                                      className={classes.icon}
                                    >
                                      {indexedItem.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                      className={matches ? classes.textPrimary : classes.hidden}
                                      primary={indexedItem.title}
                                    />
                                  </ListItem>
                                ) : ''
                              ))
                            }
                          </List>
                        </Collapse>
                      ) : ''
                  }
                </React.Fragment>
              ) : ''
            ))
          }
        </List>
        <Divider />
      </div>
    </div>
  )
}
